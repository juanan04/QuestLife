import MindMapCanvas from '../components/mindmap/MindMapCanvas';

export default function MindMapPage() {
  return (
    <div className="-m-4 md:-m-6 overflow-hidden" style={{ height: 'calc(100vh - 57px)' }}>
      <MindMapCanvas />
    </div>
  );
}
