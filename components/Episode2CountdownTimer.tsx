import CountdownTimer from './CountdownTimer';
export default function Episode2CountdownTimer({ title }: { title?: string }) {
  return <div>{title && <p className="text-center font-bold text-amber-300">{title}</p>}<CountdownTimer /></div>;
}
