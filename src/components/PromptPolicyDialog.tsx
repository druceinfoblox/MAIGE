import { useState, useEffect } from 'react';
import { X, Search } from 'lucide-react';
import { REDACT_DATA_TYPES } from '@/hooks/usePromptPolicyStore';

type Props = {
  open: boolean;
  onClose: () => void;
  onSave: (name: string, redactList: string[]) => void;
  initial?: { name: string; redactList: string[] };
};

export const PromptPolicyDialog = ({ open, onClose, onSave, initial }: Props) => {
  const [name, setName] = useState(initial?.name ?? '');
  const [selected, setSelected] = useState<string[]>(initial?.redactList ?? []);
  const [search, setSearch] = useState('');

  // Reset when dialog opens/closes or initial changes
  useEffect(() => {
    if (open) {
      setName(initial?.name ?? '');
      setSelected(initial?.redactList ?? []);
      setSearch('');
    }
  }, [open, initial]);

  if (!open) return null;

  const filtered = REDACT_DATA_TYPES.filter(dt =>
    dt.toLowerCase().includes(search.toLowerCase())
  );

  const toggle = (dt: string) => {
    setSelected(prev =>
      prev.includes(dt) ? prev.filter(s => s !== dt) : [...prev, dt]
    );
  };

  const removePill = (dt: string) => {
    setSelected(prev => prev.filter(s => s !== dt));
  };

  const handleSave = () => {
    if (!name.trim()) return;
    onSave(name.trim(), selected);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-card rounded-lg shadow-xl w-full max-w-lg mx-4">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h3 className="text-base font-bold text-foreground">Prompt Policy</h3>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-4 space-y-4">
          {/* Policy Name */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Policy Name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. PII Redaction Policy"
              className="w-full px-3 py-2 rounded-md border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
            />
          </div>

          {/* Redact List */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-0.5">Redact List</label>
            <p className="text-xs text-muted-foreground mb-2">Select data types to redact from AI prompts</p>

            {/* Selected pills */}
            <div className="border border-border rounded-md p-2 min-h-[2.5rem] mb-2 flex flex-wrap gap-1.5">
              {selected.length === 0 ? (
                <span className="text-xs text-muted-foreground py-0.5">No data types selected</span>
              ) : (
                selected.map(dt => (
                  <span
                    key={dt}
                    className="inline-flex items-center gap-1 bg-primary/10 text-primary border border-primary/20 rounded px-2 py-0.5 text-xs font-mono"
                  >
                    {dt}
                    <button
                      onClick={() => removePill(dt)}
                      className="hover:text-destructive transition-colors ml-0.5"
                    >
                      ×
                    </button>
                  </span>
                ))
              )}
            </div>

            {/* Search input */}
            <div className="relative mb-2">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search data types…"
                className="w-full pl-8 pr-3 py-1.5 rounded-full border border-border bg-background text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
              />
            </div>

            {/* Checkbox list */}
            <div className="max-h-48 overflow-y-auto border border-border rounded-md">
              {filtered.length === 0 ? (
                <div className="px-3 py-2 text-xs text-muted-foreground">No matching data types</div>
              ) : (
                filtered.map(dt => (
                  <label
                    key={dt}
                    className="flex items-center gap-2 px-3 py-1.5 hover:bg-accent/40 cursor-pointer transition-colors text-xs"
                  >
                    <input
                      type="checkbox"
                      checked={selected.includes(dt)}
                      onChange={() => toggle(dt)}
                      className="rounded border-border text-primary focus:ring-primary/40"
                    />
                    <span className="font-mono text-foreground">{dt}</span>
                  </label>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-border">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded text-sm font-medium border border-border text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!name.trim()}
            className="px-4 py-1.5 rounded text-sm font-medium bg-primary text-white hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save Policy
          </button>
        </div>
      </div>
    </div>
  );
};
