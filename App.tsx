import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import type { User } from '@supabase/supabase-js';
import { supabase } from './src/supabase';
import * as Location from 'expo-location';
import ProviderView from './src/ProviderView';

type Service = 'Pneu furado' | 'Bateria' | 'Calibragem' | 'Guincho' | 'Outro suporte';
type Screen = 'home' | 'request' | 'history' | 'provider';
const services: { name: Service; icon: string; desc: string }[] = [
  { name: 'Pneu furado', icon: '◉', desc: 'Troca, reparo ou calibragem' },
  { name: 'Bateria', icon: 'ϟ', desc: 'Partida auxiliar com cabos ou auxiliar de partida' },
  { name: 'Calibragem', icon: '◎', desc: 'Ar para pneu murcho' },
  { name: 'Guincho', icon: '↗', desc: 'Remoção do veículo' },
  { name: 'Outro suporte', icon: '+', desc: 'Conte o que aconteceu' },
];
const C = { navy: '#101820', blue: '#FF7327', pale: '#FFF2E9', bg: '#F4F5F6', muted: '#687586', line: '#E3E7EB' };
function Button({ label, onPress, secondary = false, disabled = false }: { label: string; onPress: () => void; secondary?: boolean; disabled?: boolean }) {
  return <TouchableOpacity disabled={disabled} onPress={onPress} style={[s.button, secondary && s.secondary, disabled && { opacity: .55 }]}><Text style={[s.buttonText, secondary && { color: C.blue }]}>{label}</Text></TouchableOpacity>;
}
function Field({ title, value, onChangeText, placeholder }: { title: string; value: string; onChangeText: (v: string) => void; placeholder: string }) {
  return <View style={{ marginBottom: 17 }}><Text style={s.label}>{title}</Text><TextInput style={s.input} placeholder={placeholder} placeholderTextColor="#98A5B5" value={value} onChangeText={onChangeText} multiline={title.includes('Detalhes')} /></View>;
}
export default function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const [service, setService] = useState<Service>('Pneu furado');
  const [detail, setDetail] = useState('');
  const [spare, setSpare] = useState<'sim' | 'não' | null>(null);
  const [spareInflated, setSpareInflated] = useState<'sim' | 'não' | 'não sei' | null>(null);
  const [jack, setJack] = useState<'sim' | 'não' | null>(null);
  const [wrench, setWrench] = useState<'sim' | 'não' | null>(null);
  const tools = jack && wrench ? (jack === 'sim' && wrench === 'sim' ? 'sim' : 'não') : null;
  const [batterySymptom, setBatterySymptom] = useState('');
  const [vehicleType, setVehicleType] = useState('');
  const [hasCables, setHasCables] = useState<'sim' | 'não' | null>(null);
  const [address, setAddress] = useState('');
  const [coordinates, setCoordinates] = useState<{ latitude: number; longitude: number } | null>(null);
  const [locationMessage, setLocationMessage] = useState('');
  const [locating, setLocating] = useState(false);
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [assignedNames, setAssignedNames] = useState<Record<string, string>>({});
  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data } = supabase.auth.onAuthStateChange((_event, session) => setUser(session?.user ?? null));
    return () => data.subscription.unsubscribe();
  }, []);
  function editAddress(value: string) {
    setAddress(value);
    setCoordinates(null);
    setLocationMessage('Endereço manual. Confira número e referência.');
  }
  async function useMyLocation() {
    setLocating(true);
    setLocationMessage('Obtendo sua localização...');
    try {
      const permission = await Location.requestForegroundPermissionsAsync();
      if (permission.status !== 'granted') { setLocationMessage('Permissão recusada. Você pode digitar o endereço.'); return; }
      const result = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      const point = { latitude: result.coords.latitude, longitude: result.coords.longitude };
      setCoordinates(point);
      try {
        const [place] = await Location.reverseGeocodeAsync(point);
        const formatted = [place?.street, place?.streetNumber].filter(Boolean).join(', ');
        const locality = [place?.district, place?.city].filter(Boolean).join(' - ');
        setAddress([formatted, locality].filter(Boolean).join(' · '));
        setLocationMessage('Localização obtida. Confira o endereço e o número antes de pedir.');
      } catch {
        setAddress('');
        setLocationMessage('GPS obtido. Digite a rua, o número e uma referência para confirmar o ponto.');
      }
    } catch {
      setLocationMessage('Não foi possível usar o GPS agora. Digite o endereço manualmente.');
    } finally { setLocating(false); }
  }
  async function signIn(create: boolean) {
    if (!supabase) return Alert.alert('Conexão pendente', 'Configure o projeto Supabase no arquivo .env.');
    if (!email.trim() || !password) return Alert.alert('Preencha e-mail e senha');
    setLoading(true);
    const { error } = create ? await supabase.auth.signUp({ email: email.trim(), password }) : await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setLoading(false);
    if (error) Alert.alert('Não foi possível acessar', error.message);
    else if (create) Alert.alert('Conta criada', 'Confirme seu e-mail se o projeto exigir confirmação.');
  }
  useEffect(() => {
    if (screen !== 'history' || !user) return;
    loadOrders();
    const timer = setInterval(loadOrders, 15000);
    const channel = supabase?.channel(`customer-requests-${user.id}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'service_requests', filter: `customer_id=eq.${user.id}` }, loadOrders)
      .subscribe();
    return () => { clearInterval(timer); if (channel && supabase) supabase.removeChannel(channel); };
  }, [screen, user?.id]);
  async function loadOrders() {
    if (!supabase || !user) return;
    const { data, error } = await supabase.from('service_requests').select('id,service,details,status,address,created_at,price_cents,assigned_provider_id').eq('customer_id', user.id).order('created_at', { ascending: false });
    if (error) Alert.alert('Erro ao carregar pedidos', error.message); else { setOrders(data ?? []); const active = (data ?? []).filter((row: any) => row.assigned_provider_id && ['aceito','a_caminho','chegou','em_servico'].includes(row.status)); const results = await Promise.all(active.map(async (row: any) => ({ id: row.id, result: await supabase!.rpc('get_assigned_provider', { p_request_id: row.id }) }))); setAssignedNames(Object.fromEntries(results.map(({ id, result }) => [id, result.data?.[0]?.display_name ?? 'Ajudante atribuído']))); }
  }
  async function submit() {
    if (!user) return Alert.alert('Entre na sua conta', 'Faça login para solicitar atendimento.');
    if (!address.trim() || !phone.trim()) return Alert.alert('Informações incompletas', 'Informe o endereço e um telefone de contato.');
    if (service === 'Pneu furado' && (!spare || !spareInflated || !jack || !wrench)) return Alert.alert('Informe se possui estepe, se está cheio, macaco e chave de roda.');
    if (service === 'Bateria' && (!batterySymptom.trim() || !vehicleType.trim() || !hasCables)) return Alert.alert('Informe o sintoma, tipo de veículo e se tem cabos.');
    if (!coordinates) return Alert.alert('Confirme o ponto pelo GPS', 'Neste piloto a busca de ajudantes em até 10 km precisa da sua posição. O endereço digitado serve como referência adicional.');
    if (service === 'Guincho' || service === 'Outro suporte') return Alert.alert('Orçamento em preparação', 'Este tipo de serviço ainda não tem preço e despacho definidos.');
    if (!supabase) return Alert.alert('Conexão pendente', 'Configure o Supabase antes de solicitar ajuda.');
    setLoading(true);
    const { error } = await supabase.from('service_requests').insert({ customer_id: user.id, service, details: service === 'Bateria' ? `Sintoma: ${batterySymptom.trim()}; veículo: ${vehicleType.trim()}; cliente tem cabos: ${hasCables}; observações: ${detail.trim()}` : service === 'Pneu furado' ? `Estepe: ${spare}; estepe cheio: ${spareInflated}; macaco: ${jack}; chave de roda: ${wrench}; observações: ${detail.trim()}` : detail.trim() || 'Pneu murcho; confirmar se há dano antes de calibrar.', address: address.trim(), location_lat: coordinates?.latitude ?? null, location_lng: coordinates?.longitude ?? null, contact_phone: phone.trim(), has_spare: service === 'Pneu furado' ? spare === 'sim' : null, has_tools: service === 'Pneu furado' ? tools === 'sim' : null });
    setLoading(false);
    if (error) return Alert.alert('Pedido não enviado', error.message);
    Alert.alert('Pedido de teste registrado', 'Veja o status em Meus pedidos. Ainda não há cobrança ou garantia de prestador disponível.');
    setScreen('history'); loadOrders();
  }
  if (screen === 'provider') return <SafeAreaView style={s.root}><ProviderView user={user} onBack={() => setScreen('home')} /></SafeAreaView>;
  const quote = service === 'Pneu furado' && spare === 'sim' ? (tools === 'sim' ? 69 : tools === 'não' ? 89 : null) : service === 'Bateria' ? 79 : service === 'Calibragem' ? 59 : null;
  return <SafeAreaView style={s.root}><StatusBar barStyle="dark-content" /><ScrollView contentContainerStyle={s.page}>
    <View style={s.top}><Text style={s.logo}>SUPRT<Text style={{ color: C.blue }}>●</Text></Text><TouchableOpacity onPress={() => user ? (setScreen('history'), loadOrders()) : Alert.alert('Entre na sua conta', 'Escolha um serviço para criar sua conta.')}><Text style={s.topRight}>◎ Meus pedidos</Text></TouchableOpacity></View>
    {screen === 'home' && <>
      <View style={s.welcome}><Text style={s.heading}>Precisou? A gente chega.</Text><Text style={s.sub}>Peça ajuda automotiva perto de você.</Text></View>
      <View style={s.locationBox}><Text style={s.locationIcon}>⌖</Text><View style={{ flex: 1 }}><Text style={s.locationLabel}>ONDE ESTÁ O VEÍCULO?</Text><TextInput accessibilityLabel="Endereço do veículo" style={s.locationInput} value={address} onChangeText={editAddress} placeholder="Digite rua, número e referência" placeholderTextColor="#8290A0" /></View></View>
      <TouchableOpacity accessibilityRole="button" disabled={locating} onPress={useMyLocation} style={s.gpsButton}><Text style={s.gpsText}>{locating ? 'Localizando...' : '⌖ Usar minha localização'}</Text></TouchableOpacity>{!!locationMessage && <Text style={s.locationFeedback}>{locationMessage}</Text>}
      <View style={s.mapStage} accessibilityLabel="Ilustração de mapa. A localização em tempo real ainda não está ativa."><View style={[s.street, { top: 35, transform: [{ rotate: '-13deg' }] }]} /><View style={[s.street, { top: 111, transform: [{ rotate: '16deg' }] }]} /><View style={[s.streetVertical, { left: 82, transform: [{ rotate: '21deg' }] }]} /><View style={[s.streetVertical, { right: 80, transform: [{ rotate: '-17deg' }] }]} /><View style={s.mapPin}><Text style={s.pinText}>⌖</Text></View><View style={s.mapLabel}><Text style={s.mapLabelText}>{coordinates ? 'GPS obtido · confirme o endereço' : 'Informe seu endereço para pedir ajuda'}</Text></View></View>
      <View style={s.sheet}><View style={s.handle} /><Text style={s.sheetTitle}>Qual ajuda você precisa?</Text><Text style={s.sheetCopy}>Escolha o serviço. As próximas perguntas são rápidas.</Text>
        {services.map(item => <TouchableOpacity accessibilityRole="button" key={item.name} style={s.serviceRow} onPress={() => { setService(item.name); setScreen('request'); }}><View style={s.serviceIcon}><Text style={s.serviceIconText}>{item.icon}</Text></View><View style={{ flex: 1 }}><Text style={s.serviceTitle}>{item.name === 'Bateria' ? 'Partida auxiliar' : item.name}</Text><Text style={s.serviceDesc}>{item.desc}</Text></View><Text style={s.chevron}>›</Text></TouchableOpacity>)}
        <Text style={s.availability}>● Primeiro teste: Brasilândia, São Paulo</Text>
      </View>
      <TouchableOpacity style={s.providerLink} onPress={() => setScreen('provider')}><Text style={s.providerLinkText}>Quer prestar serviços? Conheça o SUPRT  →</Text></TouchableOpacity>
    </>}
    {screen === 'request' && <><TouchableOpacity onPress={() => setScreen('home')}><Text style={s.back}>‹ Voltar</Text></TouchableOpacity><Text style={s.heading}>Solicitar {service.toLowerCase()}</Text><Text style={s.sub}>Esses detalhes ajudam o prestador a levar o equipamento certo.</Text>
      {service === 'Pneu furado' && <><Text style={s.label}>Você tem estepe?</Text><View style={s.row}>{(['sim', 'não'] as const).map(v => <TouchableOpacity key={v} onPress={() => setSpare(v)} style={[s.choice, spare === v && s.selected]}><Text style={s.choiceText}>{v === 'sim' ? 'Sim, tenho' : 'Não tenho'}</Text></TouchableOpacity>)}</View><Text style={s.label}>Seu estepe está cheio?</Text><View style={s.row}>{(['sim', 'não', 'não sei'] as const).map(v => <TouchableOpacity key={v} onPress={() => setSpareInflated(v)} style={[s.choice, spareInflated === v && s.selected]}><Text style={s.choiceText}>{v}</Text></TouchableOpacity>)}</View><Text style={s.label}>Você tem macaco?</Text><View style={s.row}>{(['sim', 'não'] as const).map(v => <TouchableOpacity key={v} onPress={() => setJack(v)} style={[s.choice, jack === v && s.selected]}><Text style={s.choiceText}>{v}</Text></TouchableOpacity>)}</View><Text style={s.label}>Você tem chave de roda?</Text><View style={s.row}>{(['sim', 'não'] as const).map(v => <TouchableOpacity key={v} onPress={() => setWrench(v)} style={[s.choice, wrench === v && s.selected]}><Text style={s.choiceText}>{v}</Text></TouchableOpacity>)}</View></>}
      {service === 'Bateria' && <><Field title="O que acontece ao tentar ligar?" value={batterySymptom} onChangeText={setBatterySymptom} placeholder="Ex.: painel acende, motor não dá partida" /><Field title="Tipo e modelo do veículo" value={vehicleType} onChangeText={setVehicleType} placeholder="Ex.: carro convencional, modelo e ano" /><Text style={s.label}>Você tem cabos para a partida auxiliar?</Text><View style={s.row}>{(['sim', 'não'] as const).map(v => <TouchableOpacity key={v} onPress={() => setHasCables(v)} style={[s.choice, hasCables === v && s.selected]}><Text style={s.choiceText}>{v === 'sim' ? 'Sim, tenho' : 'Não tenho'}</Text></TouchableOpacity>)}</View><Text style={s.sub}>A pessoa que aceitar precisa ter uma fonte de partida compatível. Se o veículo for híbrido ou elétrico, o atendimento exige avaliação especializada.</Text></>}
      <Field title="Detalhes do problema" value={detail} onChangeText={setDetail} placeholder="Ex.: Quero trocar o pneu furado pelo estepe" /><Field title="Onde você está?" value={address} onChangeText={editAddress} placeholder="Rua, número e ponto de referência" /><TouchableOpacity accessibilityRole="button" disabled={locating} onPress={useMyLocation} style={s.gpsButton}><Text style={s.gpsText}>{locating ? 'Localizando...' : '⌖ Usar minha localização'}</Text></TouchableOpacity>{!!locationMessage && <Text style={s.locationFeedback}>{locationMessage}</Text>}<Field title="Telefone de contato" value={phone} onChangeText={setPhone} placeholder="DDD + número" />
      <View style={s.note}><Text style={s.noteTitle}>{quote ? `Preço de teste: R$ ${quote}` : 'Orçamento ainda indisponível'}</Text><Text style={s.noteCopy}>{quote ? 'Valor calculado para este teste. O ajudante precisa estar aprovado, disponível e a até 10 km. Pagamento e repasse ainda não estão integrados.' : 'Precisamos confirmar o serviço e um preço antes de abrir esta categoria.'}</Text></View>
      {!user && <View style={s.auth}><Text style={s.label}>Acesse para enviar o pedido</Text><Field title="E-mail" value={email} onChangeText={setEmail} placeholder="voce@exemplo.com" /><Field title="Senha" value={password} onChangeText={setPassword} placeholder="Sua senha" /><Button label="Entrar" onPress={() => signIn(false)} disabled={loading} /><Button secondary label="Criar conta" onPress={() => signIn(true)} disabled={loading} /></View>}
      <Button label={loading ? 'Aguarde...' : 'Pedir ajuda (teste sem cobrança)'} onPress={submit} disabled={loading || !user || !quote} />
    </>}
    {screen === 'history' && <><TouchableOpacity onPress={() => setScreen('home')}><Text style={s.back}>‹ Início</Text></TouchableOpacity><Text style={s.heading}>Meus pedidos</Text><Button secondary label="Atualizar" onPress={loadOrders} />{orders.length ? orders.map(o => <View style={s.order} key={o.id}><Text style={s.cardTitle}>{o.service}</Text><Text style={s.cardCopy}>{o.address}</Text><Text style={s.status}>Status: {({ procurando: 'Buscando ajudante', aceito: 'Ajudante aceitou', a_caminho: 'A caminho', chegou: 'Chegou ao local', em_servico: 'Em atendimento', concluido: 'Concluído', sem_prestador: 'Nenhum ajudante disponível', cancelado: 'Cancelado' } as Record<string,string>)[o.status] ?? o.status}</Text>{o.price_cents && <Text style={s.cardCopy}>Valor de teste: R$ {(o.price_cents / 100).toFixed(2).replace('.', ',')}</Text>}{assignedNames[o.id] && <Text style={s.cardCopy}>Ajudante: {assignedNames[o.id]}</Text>}{o.status === 'procurando' && <Button secondary label="Cancelar busca" onPress={async () => { if (!supabase) return; const { error } = await supabase.rpc('progress_service', { p_request_id: o.id, p_next_status: 'cancelado' }); if (error) Alert.alert('Falha ao cancelar', error.message); else loadOrders(); }} />}</View>) : <Text style={s.sub}>Nenhum pedido encontrado.</Text>}</>}
    {user && <TouchableOpacity style={s.footer} onPress={() => { setScreen('history'); loadOrders(); }}><Text style={s.footerText}>Meus pedidos</Text></TouchableOpacity>}
  </ScrollView>{loading && <ActivityIndicator style={s.loader} color={C.blue} />}</SafeAreaView>;
}
const s = StyleSheet.create({ gpsButton: { padding: 12, borderRadius: 12, backgroundColor: C.pale, alignItems: 'center', marginBottom: 11 }, gpsText: { color: C.navy, fontWeight: '800' }, locationFeedback: { color: C.muted, fontSize: 12, marginBottom: 14 }, welcome: { marginTop: 12, marginBottom: 3 }, locationBox: { backgroundColor: '#FFFFFF', borderRadius: 17, padding: 16, flexDirection: 'row', alignItems: 'center', marginBottom: 16, borderWidth: 1, borderColor: C.line }, locationIcon: { color: C.blue, fontWeight: '900', fontSize: 28, marginRight: 12 }, locationLabel: { color: C.muted, fontSize: 10, fontWeight: '800', letterSpacing: 1 }, locationInput: { color: C.navy, paddingTop: 7, fontSize: 15, fontWeight: '600' }, mapStage: { height: 205, backgroundColor: '#DDE8E6', borderRadius: 22, marginBottom: -24, overflow: 'hidden', position: 'relative' }, street: { position: 'absolute', width: '130%', height: 18, backgroundColor: '#FFFFFF', left: -30 }, streetVertical: { position: 'absolute', height: '140%', width: 16, top: -30, backgroundColor: '#FFFFFF' }, mapPin: { position: 'absolute', top: 57, alignSelf: 'center', backgroundColor: C.navy, width: 49, height: 49, borderRadius: 25, alignItems: 'center', justifyContent: 'center', borderWidth: 4, borderColor: 'white' }, pinText: { color: '#FFFFFF', fontSize: 27, fontWeight: '900' }, mapLabel: { position: 'absolute', top: 113, alignSelf: 'center', backgroundColor: '#FFFFFF', borderRadius: 12, paddingVertical: 7, paddingHorizontal: 12 }, mapLabelText: { fontSize: 11, color: C.navy, fontWeight: '700' }, sheet: { backgroundColor: '#FFFFFF', borderRadius: 25, padding: 18, borderWidth: 1, borderColor: C.line }, handle: { width: 38, height: 4, borderRadius: 5, backgroundColor: '#CCD1D7', alignSelf: 'center', marginBottom: 18 }, sheetTitle: { color: C.navy, fontSize: 21, fontWeight: '900' }, sheetCopy: { color: C.muted, fontSize: 13, marginBottom: 15 }, serviceRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderTopWidth: 1, borderTopColor: C.line }, serviceIcon: { width: 46, height: 46, borderRadius: 13, backgroundColor: C.pale, alignItems: 'center', justifyContent: 'center', marginRight: 13 }, serviceIconText: { fontSize: 22, color: C.blue, fontWeight: '800' }, serviceTitle: { fontWeight: '800', fontSize: 16, color: C.navy }, serviceDesc: { fontSize: 12, color: C.muted, marginTop: 2 }, chevron: { color: '#92A0AC', fontSize: 26 }, availability: { color: '#168A67', fontWeight: '700', fontSize: 11, marginTop: 16 }, providerLink: { alignItems: 'center', padding: 20 }, providerLinkText: { color: C.navy, fontWeight: '700' }, root: { flex: 1, backgroundColor: C.bg }, page: { padding: 22, paddingBottom: 55 }, top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 18 }, logo: { fontSize: 25, fontWeight: '900', color: C.navy, letterSpacing: -1 }, topRight: { color: C.muted, fontSize: 12, fontWeight: '600' }, hero: { backgroundColor: C.navy, borderRadius: 24, padding: 27, marginTop: 18, marginBottom: 32 }, eyebrow: { color: '#8EBDFF', fontWeight: '800', fontSize: 11, letterSpacing: 1.5 }, heroTitle: { color: 'white', fontSize: 28, fontWeight: '800', lineHeight: 35, marginTop: 15 }, heroCopy: { color: '#CAD6E5', fontSize: 15, lineHeight: 22, marginTop: 14 }, heading: { color: C.navy, fontSize: 23, fontWeight: '800', marginBottom: 8 }, sub: { color: C.muted, fontSize: 15, lineHeight: 22, marginBottom: 21 }, grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }, card: { width: '48%', backgroundColor: 'white', borderRadius: 19, borderWidth: 1, borderColor: C.line, padding: 18, minHeight: 160, marginBottom: 13 }, icon: { fontSize: 28, color: C.blue, marginBottom: 19, fontWeight: '700' }, cardTitle: { fontSize: 16, fontWeight: '800', color: C.navy }, cardCopy: { fontSize: 12, lineHeight: 18, color: C.muted, marginTop: 5 }, note: { backgroundColor: C.pale, borderRadius: 18, padding: 20, marginTop: 13, marginBottom: 20 }, noteTitle: { color: C.navy, fontWeight: '800', fontSize: 17, marginBottom: 7 }, noteCopy: { color: C.muted, lineHeight: 21, marginBottom: 14 }, button: { backgroundColor: C.blue, borderRadius: 13, padding: 16, alignItems: 'center', marginBottom: 11 }, secondary: { backgroundColor: 'white', borderWidth: 1, borderColor: '#B5CFFC' }, buttonText: { color: 'white', fontWeight: '800', fontSize: 15 }, back: { color: C.blue, fontSize: 16, fontWeight: '700', marginVertical: 24 }, label: { fontSize: 14, fontWeight: '700', color: C.navy, marginBottom: 9 }, input: { borderWidth: 1, borderColor: C.line, backgroundColor: 'white', borderRadius: 12, padding: 15, color: C.navy, minHeight: 50 }, row: { flexDirection: 'row', gap: 10, marginBottom: 19 }, choice: { flex: 1, backgroundColor: 'white', borderWidth: 1, borderColor: C.line, borderRadius: 12, padding: 14, alignItems: 'center' }, selected: { borderColor: C.blue, backgroundColor: C.pale }, choiceText: { color: C.navy, fontWeight: '600' }, auth: { marginBottom: 14 }, order: { borderColor: C.line, borderWidth: 1, padding: 18, backgroundColor: 'white', borderRadius: 15, marginBottom: 12 }, status: { color: C.blue, marginTop: 10, fontWeight: '700' }, footer: { alignItems: 'center', padding: 18 }, footerText: { color: C.blue, fontWeight: '700' }, loader: { position: 'absolute', right: 25, top: 100 } });
