import styled from "@emotion/styled";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { FormEvent, useEffect, useRef, useState } from "react";

type EditorProps = {
  content: string;
  // onKeyUp: (event: FormEvent<HTMLDivElement>) => void;
  onKeyUp: (update: any) => void;
  readOnly?: boolean;
};

const Editor = styled(EditorContent)`
  background-color: white;
  .ProseMirror {
    // height: 80px;
    padding: 6px;
  }
  .ProseMirror-focused {
    // height: 80px;
    padding: 6px;
  }
`;

const Tiptap = (props: EditorProps) => {
  const { content, onKeyUp, readOnly } = props;

  const editor = useEditor({
    editable: !readOnly,
    extensions: [StarterKit],
    content: content,
  });

  // useEffect(() => {
  //   if (editor && !readOnly) {
  //     editor.commands.focus();
  //   }
  // });

  if (!editor) {
    return null;
  }

  const json = editor.getJSON();

  // console.log("json: ", json);

  return <Editor editor={editor} onKeyUp={() => onKeyUp(json)} />;
};

export default Tiptap;
