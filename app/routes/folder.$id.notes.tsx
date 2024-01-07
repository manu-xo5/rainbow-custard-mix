import Navbar from "@/components/Navbar";
import BackIcon from "@/icons/BackIcon";
import {
  addNote,
  deleteNotes,
  getFolder,
  getNotes,
  updateNote,
} from "@/lib/api";
import type { ActionFunction, LoaderFunctionArgs } from "@remix-run/node";
import { redirect, json, defer } from "@remix-run/node";
import {
  Await,
  Form,
  Link,
  useLoaderData,
  useParams,
  useSubmit,
} from "@remix-run/react";
import * as O from "@/lib/O";
import { Suspense, useRef, useState } from "react";
import { ScrollArea } from "@/components/ScrollArea";
import { LoaderScreen } from "@/components/LoaderScreen";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  if (params.id == null) return redirect("/404");

  const notes = getNotes(params.id) as Promise<any[]>;
  const folder = getFolder(params.id);

  return defer({
    folder,
    notes,
  });
};

export const action: ActionFunction = async ({ request }) => {
  const fd = await request.formData();
  if (fd.get("_action") === "new_note") {
    await O.pipe(
      0,
      () => Object.fromEntries(fd) as Record<string, string>,
      O.tryCatch((body) => addNote(body))
    );
  } else if (fd.get("_action") === "delete_notes") {
    await deleteNotes({
      folder_id: [fd.get("folder_id")],
      selected_notes: fd.getAll("selected_notes"),
    });
  } else {
    await O.pipe(
      fd,
      (x) => Object.fromEntries(x) as Record<string, string>,
      O.tryCatch((body) =>
        updateNote(body.folder_id, body.note_id, String(body.note).trim())
      ),
      (_) => console.count("hit " + fd.get("note"))
    );
  }

  return null;
};

export default function Notes() {
  const params = useParams();
  const { folder, notes } = useLoaderData<typeof loader>();
  const submit = useSubmit();
  const timerRef = useRef(0);

  const [mode, setMode] = useState("idle");
  // const [selected, setSelected] = useState<string[]>([]);

  return (
    <>
      <Navbar
        title="Memo"
        left={
          <Link to="/" className="aspect-square place-items-center">
            <BackIcon />
          </Link>
        }
        right={
          mode === "idle" ? (
            <button
              type="button"
              onClick={() => setMode("delete")}
              name="yoops"
              className="text-base"
            >
              Edit
            </button>
          ) : (
            <button
              form="main"
              name="_action"
              value="delete_notes"
              className="text-base"
            >
              Delete
            </button>
          )
        }
      />

      <Suspense fallback={<LoaderScreen />}>
        <Await
          resolve={Promise.all([notes, folder])}
          errorElement={"server error"}
        >
          {([notes, folder]) => (
            <ScrollArea>
              <div id="notes-list">
                {mode === "delete" ? (
                  <>
                    <Form
                      id="main"
                      action="."
                      method="POST"
                      className="notes-form"
                    >
                      <input type="hidden" name="folder_id" value={params.id} />

                      {notes.map((note: any) => (
                        <div
                          key={note.id}
                          className="m-5 grow-wrap text-base leading-[24px]"
                          data-replicated-value={note.note}
                        >
                          <label
                            style={{
                              backgroundColor:
                                folder.accentColor !== "#000000"
                                  ? folder.accentColor
                                  : "#777",
                            }}
                            className="target whitespace-pre-wrap gradiant rounded-sm w-full block outline-0 select-none outline-accent"
                          >
                            {note.note}
                            <input
                              hidden
                              type="checkbox"
                              name="selected_notes"
                              value={note.id}
                            />
                          </label>
                        </div>
                      ))}
                    </Form>
                  </>
                ) : (
                  notes.map((note: any) => (
                    <Form
                      id="main"
                      action="."
                      key={note.id}
                      method="POST"
                      className="notes-form m-5"
                    >
                      <input type="hidden" name="folder_id" value={params.id} />
                      <input type="hidden" name="note_id" value={note.id} />

                      <div
                        className="grow-wrap text-base leading-[24px]"
                        data-replicated-value={note.note}
                      >
                        <textarea
                          disabled={mode === "delete"}
                          id={note.id}
                          onKeyUp={(e) => {
                            clearTimeout(timerRef.current);
                            let id = setTimeout(
                              submit,
                              1000,
                              e.currentTarget.form,
                              {
                                replace: true,
                              }
                            );
                            timerRef.current = id as unknown as number;
                          }}
                          onInput={(e) => {
                            e.currentTarget.parentElement!.dataset.replicatedValue =
                              e.currentTarget.value;
                          }}
                          name="note"
                          style={{
                            backgroundColor:
                              folder.accentColor !== "#000000"
                                ? folder.accentColor
                                : "#777",
                          }}
                          className="target gradiant rounded-sm w-full block outline-none"
                        >
                          {note.note}
                        </textarea>
                      </div>
                    </Form>
                  ))
                )}

                <Form method="POST" className="notes-form m-5">
                  <input type="hidden" name="folder_id" value={params.id} />
                  <input type="hidden" name="note" value="" />
                  <input type="hidden" name="_action" value="new_note" />
                  <button className="py-1.5 bg-primary rounded-sm w-full flex justify-center items-center">
                    Add New Note
                  </button>
                </Form>
              </div>
            </ScrollArea>
          )}
        </Await>
      </Suspense>
    </>
  );
}
