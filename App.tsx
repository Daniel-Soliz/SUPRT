import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import type { User } from '@supabase/supabase-js';
import { supabase } from './src/supabase';

type Service = 'Pneu furado' | 'Bateria' | 'Guincho' | 'Outro suporte';
type Screen = 'home' | 'request' | 'history' | 'provider';
const services: { name: Service; icon: string; desc: string }[] = [
  { name: 'Pneu furado', icon: '◉', desc: 'Troca, reparo ou calibragem' },
  { name: 'Bateria', icon: 'ϟ', desc: 'Carga auxiliar ou substituição' },
  { name: 'Guincho', icon: '↗', desc: 'Remoção do veículo' },
  { name: 'Outro suporte', icon: '+', desc: 'Conte o que aconteceu' },
];
const C = { navy: '#12253B', blue: '#1769E0', pale: '#EAF2FF', bg: '#F7F9FC', muted: '#657488', line: '#E2E8F0' };
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
  const [tools, setTools] = useState<'sim' | 'não' | null>(null);
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data } = supabase.auth.onAuthStateChange((_event, session) => setUser(session?.user ?? null));
    return () => data.subscription.unsubscribe();
  }, []);
  async function signIn(create: boolean) {
    if (!supabase) return Alert.alert('Conexão pendente', 'Configure o projeto Supabase no arquivo .env.');
    if (!email.trim() || !password) return Alert.alert('Preencha e-mail e senha');
    setLoading(true);
    const { error } = create ? await supabase.auth.signUp({ email: email.trim(), password }) : await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setLoading(false);
    if (error) Alert.alert('Não foi possível acessar', error.message);
    else if (create) Alert.alert('Conta criada', 'Confirme seu e-mail se o projeto exigir confirmação.');
  }
  async function loadOrders() {
    if (!supabase || !user) return;
    const { data, error } = await supabase.from('service_requests').select('id,service,details,status,address,created_at').eq('customer_id', user.id).order('created_at', { ascending: false });
    if (error) Alert.alert('Erro ao carregar pedidos', error.message); else setOrders(data ?? []);
  }
  async function submit() {
    if (!user) return Alert.alert('Entre na sua conta', 'Faça login para solicitar atendimento.');
    if (!address.trim() || !detail.trim() || !phone.trim()) return Alert.alert('Informações incompletas', 'Informe o endereço, telefone e os detalhes do problema.');
    if (service === 'Pneu furado' && (!spare || !tools)) return Alert.alert('Informe se possui estepe, macaco e chave de roda.');
    if (!supabase) return Alert.alert('Conexão pendente', 'Configure o Supabase antes de solicitar ajuda.');
    setLoading(true);
    const { error } = await supabase.from('service_requests').insert({ customer_id: user.id, service, details: detail.trim(), address: address.trim(), contact_phone: phone.trim(), has_spare: service === 'Pneu furado' ? spare === 'sim' : null, has_tools: service === 'Pneu furado' ? tools === 'sim' : null });
    setLoading(false);
    if (error) return Alert.alert('Pedido não enviado', error.message);
    Alert.alert('Pedido registrado', 'Estamos preparando a próxima etapa do atendimento.');
    setScreen('history'); loadOrders();
  }
  return <SafeAreaView style={s.root}><StatusBar barStyle="dark-content" /><ScrollView contentContainerStyle={s.page}>
    <View style={s.top}><Text style={s.logo}>SUPRT<Text style={{ color: C.blue }}>●</Text></Text><Text style={s.topRight}>Ajuda na estrada</Text></View>
    {screen === 'home' && <>
      <View style={s.hero}><Text style={s.eyebrow}>SUPORTE AUTOMOTIVO</Text><Text style={s.heroTitle}>Imprevisto no caminho?{'\n'}A ajuda começa aqui.</Text><Text style={s.heroCopy}>Conte o que aconteceu e solicite atendimento onde você estiver.</Text></View>
      <Text style={s.heading}>Como podemos ajudar?</Text><Text style={s.sub}>Escolha o tipo de suporte para começar.</Text>
      <View style={s.grid}>{services.map(item => <TouchableOpacity key={item.name} style={s.card} onPress={() => { setService(item.name); setScreen('request'); }}><Text style={s.icon}>{item.icon}</Text><Text style={s.cardTitle}>{item.name}</Text><Text style={s.cardCopy}>{item.desc}</Text></TouchableOpacity>)}</View>
      <View style={s.note}><Text style={s.noteTitle}>Para quem presta serviços</Text><Text style={s.noteCopy}>Autônomos e empresas poderão receber chamados pela plataforma.</Text><Button secondary label="Área do prestador" onPress={() => setScreen('provider')} /></View>
    </>}
    {screen === 'request' && <><TouchableOpacity onPress={() => setScreen('home')}><Text style={s.back}>‹ Voltar</Text></TouchableOpacity><Text style={s.heading}>Solicitar {service.toLowerCase()}</Text><Text style={s.sub}>Esses detalhes ajudam o prestador a levar o equipamento certo.</Text>
      {service === 'Pneu furado' && <><Text style={s.label}>Você tem estepe?</Text><View style={s.row}>{(['sim', 'não'] as const).map(v => <TouchableOpacity key={v} onPress={() => setSpare(v)} style={[s.choice, spare === v && s.selected]}><Text style={s.choiceText}>{v === 'sim' ? 'Sim, tenho' : 'Não tenho'}</Text></TouchableOpacity>)}</View><Text style={s.label}>Você tem macaco e chave de roda?</Text><View style={s.row}>{(['sim', 'não'] as const).map(v => <TouchableOpacity key={v} onPress={() => setTools(v)} style={[s.choice, tools === v && s.selected]}><Text style={s.choiceText}>{v === 'sim' ? 'Sim' : 'Não'}</Text></TouchableOpacity>)}</View></>}
      <Field title="Detalhes do problema" value={detail} onChangeText={setDetail} placeholder="Ex.: Quero trocar o pneu furado pelo estepe" /><Field title="Onde você está?" value={address} onChangeText={setAddress} placeholder="Rua, número e ponto de referência" /><Field title="Telefone de contato" value={phone} onChangeText={setPhone} placeholder="DDD + número" />
      <View style={s.note}><Text style={s.noteTitle}>Valor e disponibilidade</Text><Text style={s.noteCopy}>O cálculo do preço e o envio a prestadores próximos precisam ser configurados antes da operação. Nenhuma cobrança é feita nesta etapa.</Text></View>
      {!user && <View style={s.auth}><Text style={s.label}>Acesse para enviar o pedido</Text><Field title="E-mail" value={email} onChangeText={setEmail} placeholder="voce@exemplo.com" /><Field title="Senha" value={password} onChangeText={setPassword} placeholder="Sua senha" /><Button label="Entrar" onPress={() => signIn(false)} disabled={loading} /><Button secondary label="Criar conta" onPress={() => signIn(true)} disabled={loading} /></View>}
      <Button label={loading ? 'Aguarde...' : 'Registrar pedido'} onPress={submit} disabled={loading || !user} />
    </>}
    {screen === 'history' && <><TouchableOpacity onPress={() => setScreen('home')}><Text style={s.back}>‹ Início</Text></TouchableOpacity><Text style={s.heading}>Meus pedidos</Text><Button secondary label="Atualizar" onPress={loadOrders} />{orders.length ? orders.map(o => <View style={s.order} key={o.id}><Text style={s.cardTitle}>{o.service}</Text><Text style={s.cardCopy}>{o.address}</Text><Text style={s.status}>Status: {o.status}</Text></View>) : <Text style={s.sub}>Nenhum pedido encontrado.</Text>}</>}
    {screen === 'provider' && <><TouchableOpacity onPress={() => setScreen('home')}><Text style={s.back}>‹ Voltar</Text></TouchableOpacity><Text style={s.heading}>Trabalhe com o SUPRT</Text><Text style={s.sub}>Cadastro de profissionais e empresas, verificação de documentos, ofertas de atendimento e aceite de valores fazem parte da próxima etapa do aplicativo.</Text><View style={s.note}><Text style={s.noteTitle}>Em preparação</Text><Text style={s.noteCopy}>O recebimento de chamados ainda não está disponível. Esta tela não mostra pedidos reais.</Text></View></>}
    {user && <TouchableOpacity style={s.footer} onPress={() => { setScreen('history'); loadOrders(); }}><Text style={s.footerText}>Meus pedidos</Text></TouchableOpacity>}
  </ScrollView>{loading && <ActivityIndicator style={s.loader} color={C.blue} />}</SafeAreaView>;
}
const s = StyleSheet.create({ root: { flex: 1, backgroundColor: C.bg }, page: { padding: 22, paddingBottom: 55 }, top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 18 }, logo: { fontSize: 25, fontWeight: '900', color: C.navy, letterSpacing: -1 }, topRight: { color: C.muted, fontSize: 12, fontWeight: '600' }, hero: { backgroundColor: C.navy, borderRadius: 24, padding: 27, marginTop: 18, marginBottom: 32 }, eyebrow: { color: '#8EBDFF', fontWeight: '800', fontSize: 11, letterSpacing: 1.5 }, heroTitle: { color: 'white', fontSize: 28, fontWeight: '800', lineHeight: 35, marginTop: 15 }, heroCopy: { color: '#CAD6E5', fontSize: 15, lineHeight: 22, marginTop: 14 }, heading: { color: C.navy, fontSize: 23, fontWeight: '800', marginBottom: 8 }, sub: { color: C.muted, fontSize: 15, lineHeight: 22, marginBottom: 21 }, grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }, card: { width: '48%', backgroundColor: 'white', borderRadius: 19, borderWidth: 1, borderColor: C.line, padding: 18, minHeight: 160, marginBottom: 13 }, icon: { fontSize: 28, color: C.blue, marginBottom: 19, fontWeight: '700' }, cardTitle: { fontSize: 16, fontWeight: '800', color: C.navy }, cardCopy: { fontSize: 12, lineHeight: 18, color: C.muted, marginTop: 5 }, note: { backgroundColor: C.pale, borderRadius: 18, padding: 20, marginTop: 13, marginBottom: 20 }, noteTitle: { color: C.navy, fontWeight: '800', fontSize: 17, marginBottom: 7 }, noteCopy: { color: C.muted, lineHeight: 21, marginBottom: 14 }, button: { backgroundColor: C.blue, borderRadius: 13, padding: 16, alignItems: 'center', marginBottom: 11 }, secondary: { backgroundColor: 'white', borderWidth: 1, borderColor: '#B5CFFC' }, buttonText: { color: 'white', fontWeight: '800', fontSize: 15 }, back: { color: C.blue, fontSize: 16, fontWeight: '700', marginVertical: 24 }, label: { fontSize: 14, fontWeight: '700', color: C.navy, marginBottom: 9 }, input: { borderWidth: 1, borderColor: C.line, backgroundColor: 'white', borderRadius: 12, padding: 15, color: C.navy, minHeight: 50 }, row: { flexDirection: 'row', gap: 10, marginBottom: 19 }, choice: { flex: 1, backgroundColor: 'white', borderWidth: 1, borderColor: C.line, borderRadius: 12, padding: 14, alignItems: 'center' }, selected: { borderColor: C.blue, backgroundColor: C.pale }, choiceText: { color: C.navy, fontWeight: '600' }, auth: { marginBottom: 14 }, order: { borderColor: C.line, borderWidth: 1, padding: 18, backgroundColor: 'white', borderRadius: 15, marginBottom: 12 }, status: { color: C.blue, marginTop: 10, fontWeight: '700' }, footer: { alignItems: 'center', padding: 18 }, footerText: { color: C.blue, fontWeight: '700' }, loader: { position: 'absolute', right: 25, top: 100 } });
