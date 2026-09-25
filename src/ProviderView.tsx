import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import type { User } from '@supabase/supabase-js';
import * as Location from 'expo-location';
import { supabase } from './supabase';

type Profile = { user_id: string; kind: 'pf' | 'pj'; display_name: string; approval_status: string; is_available: boolean; tire: boolean; battery: boolean; air: boolean; towing: boolean; has_jack: boolean; has_jumper: boolean; has_compressor: boolean; location_updated_at: string | null };
type Offer = { id: string; request_id: string; service: string; details: string; has_spare: boolean | null; has_tools: boolean | null; distance_km: number; price_cents: number; expires_at: string };
type Job = { id: string; service: string; details: string; address: string; contact_phone: string; status: string; price_cents: number | null };
const labels: Record<string, string> = { aceito: 'Aceito', a_caminho: 'A caminho', chegou: 'Cheguei', em_servico: 'Em atendimento', concluido: 'Concluído', cancelado: 'Cancelado' };
const next: Record<string, { status: string; title: string }> = { aceito: { status: 'a_caminho', title: 'Estou a caminho' }, a_caminho: { status: 'chegou', title: 'Cheguei ao local' }, chegou: { status: 'em_servico', title: 'Iniciar atendimento' }, em_servico: { status: 'concluido', title: 'Concluir atendimento' } };
function money(value: number) { return (value / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }); }
function Action({ title, onPress, outline = false, disabled = false }: { title: string; onPress: () => void; outline?: boolean; disabled?: boolean }) { return <TouchableOpacity accessibilityRole="button" onPress={onPress} disabled={disabled} style={[s.action, outline && s.outline, disabled && { opacity: .5 }]}><Text style={[s.actionText, outline && { color: '#101820' }]}>{title}</Text></TouchableOpacity>; }
export default function ProviderView({ user, onBack }: { user: User | null; onBack: () => void }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [kind, setKind] = useState<'pf' | 'pj'>('pf');
  const [name, setName] = useState('');
  const [capabilities, setCapabilities] = useState({ tire: true, battery: false, air: false, has_jack: false, has_jumper: false, has_compressor: false });
  const [email, setEmail] = useState(''); const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const refresh = useCallback(async () => {
    if (!supabase || !user) return;
    const [p, o, j] = await Promise.all([
      supabase.from('provider_profiles').select('*').eq('user_id', user.id).maybeSingle(),
      supabase.from('dispatch_offers').select('id,request_id,expires_at').eq('provider_id', user.id).eq('status', 'pending').gt('expires_at', new Date().toISOString()).order('created_at', { ascending: false }).limit(10),
      supabase.from('service_requests').select('id,service,details,address,contact_phone,status,price_cents').eq('assigned_provider_id', user.id).in('status', ['aceito','a_caminho','chegou','em_servico']).limit(10),
    ]);
    if (p.error) setMessage(p.error.message); else setProfile(p.data as Profile | null);
    if (j.error) setMessage(j.error.message); else setJobs((j.data ?? []) as Job[]);
    if (o.error) { setMessage(o.error.message); return; }
    const details = await Promise.all((o.data ?? []).map(async offer => {
      const result = await supabase!.rpc('get_provider_offer_details', { p_offer_id: offer.id });
      const info = result.data?.[0];
      return result.error || !info ? null : { ...offer, ...info } as Offer;
    }));
    setOffers(details.filter((offer): offer is Offer => offer !== null));
  }, [user?.id]);
  useEffect(() => {
    refresh();
    const timer = setInterval(refresh, 15000);
    const channel = user && supabase ? supabase.channel(`provider-offers-${user.id}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'dispatch_offers', filter: `provider_id=eq.${user.id}` }, refresh)
      .subscribe() : null;
    return () => { clearInterval(timer); if (channel && supabase) supabase.removeChannel(channel); };
  }, [refresh, user?.id]);
  async function signIn(create: boolean) {
    if (!supabase || !email.trim() || !password) return Alert.alert('Informe e-mail e senha');
    setBusy(true);
    const { error } = create ? await supabase.auth.signUp({ email: email.trim(), password }) : await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setBusy(false);
    if (error) Alert.alert('Acesso não concluído', error.message); else if (create) Alert.alert('Conta criada', 'Confirme o e-mail se solicitado e volte para completar seu cadastro.');
  }
  async function enroll() {
    if (!supabase || !user || name.trim().length < 2) return Alert.alert('Informe seu nome ou o nome da empresa');
    setBusy(true);
    const { error } = await supabase.from('provider_profiles').insert({ user_id: user.id, kind, display_name: name.trim(), ...capabilities, towing: false });
    setBusy(false);
    if (error) Alert.alert('Não foi possível cadastrar', error.message); else { setMessage('Cadastro enviado para análise. Você poderá ficar disponível após aprovação.'); refresh(); }
  }
  async function availability(turnOn: boolean) {
    if (!supabase || !user) return;
    setBusy(true);
    try {
      if (turnOn) {
        const permission = await Location.requestForegroundPermissionsAsync();
        if (permission.status !== 'granted') { setMessage('Ative a localização para receber pedidos próximos.'); return; }
        const point = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
        const { error } = await supabase.from('provider_profiles').update({ lat: point.coords.latitude, lng: point.coords.longitude, is_available: true }).eq('user_id', user.id);
        if (error) throw error;
        setMessage('Disponível por até 10 minutos a partir desta posição. Atualize seu GPS para continuar recebendo ofertas.');
      } else {
        const { error } = await supabase.from('provider_profiles').update({ is_available: false }).eq('user_id', user.id);
        if (error) throw error;
        setMessage('Você está indisponível para novas ofertas.');
      }
      await refresh();
    } catch (error) { Alert.alert('Localização indisponível', error instanceof Error ? error.message : 'Tente novamente.'); }
    finally { setBusy(false); }
  }
  async function accept(id: string) {
    if (!supabase) return;
    setBusy(true);
    const { error } = await supabase.rpc('accept_service_offer', { p_offer_id: id });
    setBusy(false);
    if (error) Alert.alert('Oferta indisponível', error.message); else { setMessage('Atendimento aceito. Confira o endereço e vá até o cliente.'); refresh(); }
  }
  async function progress(id: string, status: string) {
    if (!supabase) return;
    setBusy(true);
    const { error } = await supabase.rpc('progress_service', { p_request_id: id, p_next_status: status });
    setBusy(false);
    if (error) Alert.alert('Não foi possível atualizar', error.message); else refresh();
  }
  const flag = (key: keyof typeof capabilities, title: string) => <TouchableOpacity accessibilityRole="checkbox" accessibilityState={{ checked: capabilities[key] }} onPress={() => setCapabilities({ ...capabilities, [key]: !capabilities[key] })} style={s.flag}><Text style={s.flagText}>{capabilities[key] ? '☑' : '□'} {title}</Text></TouchableOpacity>;
  return <ScrollView contentContainerStyle={s.page}>
    <TouchableOpacity onPress={onBack}><Text style={s.back}>‹ Voltar para cliente</Text></TouchableOpacity>
    <Text style={s.title}>Área do ajudante</Text><Text style={s.copy}>Receba ofertas perto de você quando estiver aprovado e disponível.</Text>
    {!user ? <View style={s.panel}><Text style={s.heading}>Entre ou crie sua conta</Text><TextInput style={s.input} value={email} onChangeText={setEmail} placeholder="E-mail" autoCapitalize="none" keyboardType="email-address" /><TextInput style={s.input} value={password} onChangeText={setPassword} placeholder="Senha" secureTextEntry /><Action title="Entrar" onPress={() => signIn(false)} disabled={busy} /><Action title="Criar conta" onPress={() => signIn(true)} outline disabled={busy} /></View>
    : !profile ? <View style={s.panel}><Text style={s.heading}>Seu cadastro</Text><Text style={s.copy}>Escolha serviços que consegue fazer. A aprovação será feita pela equipe antes de receber pedidos.</Text><View style={s.row}><Action title="Pessoa física" onPress={() => setKind('pf')} outline={kind !== 'pf'} /><Action title="Empresa (CNPJ)" onPress={() => setKind('pj')} outline={kind !== 'pj'} /></View><TextInput style={s.input} value={name} onChangeText={setName} placeholder={kind === 'pf' ? 'Seu nome' : 'Nome da empresa'} />{flag('tire', 'Troca pelo estepe')}{flag('battery', 'Partida auxiliar')}{flag('air', 'Calibragem')}{flag('has_jack', 'Tenho macaco e chave de roda')}{flag('has_jumper', 'Tenho fonte e cabos de partida')}{flag('has_compressor', 'Tenho compressor e manômetro')}<Action title="Enviar cadastro" onPress={enroll} disabled={busy} /></View>
    : <><View style={s.panel}><Text style={s.heading}>{profile.display_name}</Text><Text style={s.copy}>Cadastro {profile.kind.toUpperCase()} · {profile.approval_status === 'approved' ? 'Aprovado' : 'Em análise'}</Text>{profile.approval_status === 'approved' ? <><Text style={s.copy}>{profile.is_available ? '● Disponível · posição válida por 10 minutos' : '○ Indisponível'}</Text><Action title={profile.is_available ? 'Atualizar minha posição' : 'Usar GPS e ficar disponível'} onPress={() => availability(true)} disabled={busy} /><Action title="Ficar indisponível" outline onPress={() => availability(false)} disabled={busy || !profile.is_available} /></> : <Text style={s.notice}>A equipe precisa verificar seu cadastro antes de liberar ofertas.</Text>}</View>
      <Text style={s.heading}>Meus atendimentos</Text>{jobs.length ? jobs.map(job => <View key={job.id} style={s.panel}><Text style={s.heading}>{job.service}</Text><Text style={s.copy}>{job.address}</Text><Text style={s.copy}>{job.details}</Text><Text style={s.copy}>Contato: {job.contact_phone}</Text><Text style={s.notice}>Status: {labels[job.status] ?? job.status}</Text>{next[job.status] && <Action title={next[job.status].title} onPress={() => progress(job.id, next[job.status].status)} disabled={busy} />}</View>) : <Text style={s.copy}>Nenhum atendimento atribuído.</Text>}
      <Text style={s.heading}>Ofertas próximas</Text><Text style={s.copy}>Atualização enquanto esta tela estiver aberta.</Text>{offers.length ? offers.map(offer => <View key={offer.id} style={s.panel}><Text style={s.heading}>{offer.service} · {money(offer.price_cents)}</Text><Text style={s.copy}>Aproximadamente {offer.distance_km} km · expira às {new Date(offer.expires_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</Text><Text style={s.copy}>{offer.details}</Text><Text style={s.copy}>Estepe: {offer.has_spare === null ? 'não se aplica' : offer.has_spare ? 'sim' : 'não'} · ferramentas do cliente: {offer.has_tools === null ? 'não se aplica' : offer.has_tools ? 'sim' : 'não'}</Text><Text style={s.notice}>Valor de teste ao cliente. Pagamento e repasse ainda não estão integrados.</Text><Action title="Aceitar teste de atendimento" onPress={() => accept(offer.id)} disabled={busy} /></View>) : <Text style={s.copy}>Sem ofertas ativas agora.</Text>}<Action title="Atualizar ofertas" onPress={refresh} outline disabled={busy} /></>}
    {message ? <Text style={s.message}>{message}</Text> : null}{busy && <ActivityIndicator color="#FF7327" />}
  </ScrollView>;
}
const s = StyleSheet.create({ page: { padding: 22, paddingBottom: 70, backgroundColor: '#F4F5F6', minHeight: '100%' }, back: { color: '#FF7327', fontWeight: '800', marginBottom: 22 }, title: { fontSize: 27, fontWeight: '900', color: '#101820' }, heading: { fontSize: 17, fontWeight: '800', color: '#101820', marginBottom: 12 }, copy: { color: '#687586', lineHeight: 20, marginBottom: 13 }, panel: { backgroundColor: 'white', borderRadius: 18, padding: 19, marginVertical: 13, borderWidth: 1, borderColor: '#E3E7EB' }, input: { backgroundColor: '#F7F8F9', borderWidth: 1, borderColor: '#E3E7EB', borderRadius: 12, padding: 14, marginBottom: 12 }, action: { backgroundColor: '#101820', borderRadius: 12, padding: 14, alignItems: 'center', marginTop: 7, flex: 1 }, outline: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#CCD3D9' }, actionText: { color: 'white', fontWeight: '800' }, row: { flexDirection: 'row', gap: 9, marginBottom: 15 }, flag: { padding: 12, borderBottomWidth: 1, borderBottomColor: '#E3E7EB' }, flagText: { fontWeight: '600', color: '#101820' }, notice: { color: '#945420', backgroundColor: '#FFF2E9', padding: 12, borderRadius: 10, marginVertical: 7 }, message: { color: '#176448', marginTop: 12 } });
