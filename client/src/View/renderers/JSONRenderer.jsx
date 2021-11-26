export default function JSONRenderer(props) {
  return (
    <div>
      <code className="whitespace-pre">{props.json}</code>
    </div>
  );
}
