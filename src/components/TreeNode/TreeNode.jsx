import './TreeNode.css'

export default function TreeNode({ id, label, isLast, isActive, onSelect }) {
  const prefix = isLast ? '└── ' : '├── '

  return (
    <div className="tree-node">
      <button
        className={`tree-node__label ${isActive ? 'tree-node__label--active' : ''}`}
        onClick={() => onSelect(id)}
      >
        <span className="tree-node__prefix">{prefix}</span>
        <span className="tree-node__name">{label}/</span>
      </button>
    </div>
  )
}
