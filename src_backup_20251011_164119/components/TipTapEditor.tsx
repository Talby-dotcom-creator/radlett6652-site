import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useEffect } from 'react'

type Props = {
  value: string
  onChange: (html: string) => void
  placeholder?: string
  className?: string
}

export default function TipTapEditor({ value, onChange, placeholder, className }: Props) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value || '<p></p>',
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'prose max-w-none focus:outline-none',
        'data-placeholder': placeholder ?? '',
      } as any,
    },
  })

  // sync external value
  useEffect(() => {
    if (!editor) return
    const current = editor.getHTML()
    if (value !== current) {
      editor.commands.setContent(value || '<p></p>', { emitUpdate: false }) // ✅ fixed
    }
  }, [value, editor])

  return (
    <div className={className}>
      <div className="rounded-xl border p-3 min-h-[200px]">
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}
