'use client';
import { useEffect, useState } from 'react';
import { Volume2, Pause, Play } from 'lucide-react';
export default function VoiceGuide({ text }: { text: string }) {
  const [supported, setSupported] = useState(false);
  const [status, setStatus] = useState<'idle' | 'speaking' | 'paused'>('idle');
  const [error, setError] = useState('');
  useEffect(() => { setSupported('speechSynthesis' in window); return () => { if ('speechSynthesis' in window) window.speechSynthesis.cancel(); }; }, []);
  useEffect(() => { const reset = () => setStatus('idle'); window.addEventListener('uvaco-speech-reset', reset); return () => window.removeEventListener('uvaco-speech-reset', reset); }, []);
  useEffect(() => { if ('speechSynthesis' in window) window.speechSynthesis.cancel(); setStatus('idle'); }, [text]);
  function toggle() {
    if (!supported) return;
    const synth = window.speechSynthesis;
    if (status === 'speaking') { synth.pause(); setStatus('paused'); return; }
    if (status === 'paused') { synth.resume(); setStatus('speaking'); return; }
    window.dispatchEvent(new Event('uvaco-speech-reset')); synth.cancel();
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = 'zh-TW'; speech.rate = .92;
    const voice = synth.getVoices().find(v => v.lang === 'zh-TW'); if (voice) speech.voice = voice;
    speech.onend = () => setStatus('idle'); speech.onerror = event => { setStatus('idle'); if (event.error !== 'canceled' && event.error !== 'interrupted') setError('這台裝置暫時無法播放語音。'); };
    setError(''); synth.speak(speech); setStatus('speaking');
  }
  return <div><button className="voice-button" disabled={!supported} onClick={toggle}>{status === 'speaking' ? <Pause size={20} /> : status === 'paused' ? <Play size={20} /> : <Volume2 size={20} />}{!supported ? '此裝置不支援語音' : status === 'speaking' ? '暫停語音導覽' : status === 'paused' ? '繼續語音導覽' : '聽語音導覽'}</button>{error && <p role="status" className="small-copy">{error}</p>}</div>;
}
