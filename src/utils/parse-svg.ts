import { select } from 'd3';
export function parseSvg(document: File, node: HTMLElement) {
  const reader = new FileReader();
  reader.addEventListener('loadend', (e) => {
    const result = reader.result;
    if (result && typeof result === 'string') {
      select(node).html(result);
    }
  });
  reader.readAsText(document);
}
