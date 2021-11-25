import { useView } from './ViewContext';
import ImageRenderer from './renderers/ImageRenderer';

export default function ViewMain() {
  const { elements } = useView();
  return (
    <main className="flex flex-col gap-2 pt-6">
      {elements.map((element) => {
        switch (element.kind) {
          case 'IMAGE':
            return <ImageRenderer key={element.id} {...element} />;
          default:
            throw new Error(`unknown element kind: ${element.kind}`);
        }
      })}
    </main>
  );
}
