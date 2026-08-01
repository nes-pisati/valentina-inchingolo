export default function EmText({ text }: { text: string }) {
  const parts = text.split(/\*([^*]+)\*/g)
  return (
    <>
      {parts.map((part, i) => (i % 2 === 1 ? <em key={i}>{part}</em> : part))}
    </>
  )
}
