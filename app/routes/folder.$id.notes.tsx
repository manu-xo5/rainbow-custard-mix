import * as React from "react";
import Navbar from "@/components/Navbar";
import BackIcon from "@/icons/BackIcon";
import { Folder, addNote, deleteNotes, getNotes, updateNote } from "@/lib/api";
import type { ActionFunction, LoaderFunctionArgs } from "@remix-run/node";
import { redirect, defer } from "@remix-run/node";
import {
  Await,
  Form,
  Link,
  useLoaderData,
  useParams,
  useSubmit,
} from "@remix-run/react";
import * as O from "@/lib/O";
import { Suspense, useRef } from "react";
import { ScrollArea } from "@/components/ScrollArea";
import { LoaderScreen } from "@/components/LoaderScreen";

/** GET **/
export const loader = async ({ params }: LoaderFunctionArgs) => {
  if (params.id == null) return redirect("/404");

  const notes = getNotes(params.id) as Promise<any[]>;
  const folder = await Folder.get(params.id);

  return defer({ notes, folder });
};

/** POST **/
export const action: ActionFunction = async ({ request }) => {
  const fd = await request.formData();
  if (fd.get("_action") === "update_folder") {
    const title = fd.get("title")?.toString();
    const folderId = fd.get("folderId")?.toString();

    if (!title || !folderId)
      throw Error("title or folderId is not typeof String");

    await Folder.updateFolder({ title, folderId });
  } else if (fd.get("_action") === "new_note") {
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

/** CLIENT **/
export default function Notes() {
  const params = useParams();
  const loaderData = useLoaderData<typeof loader>();
  const { notes, folder } = loaderData;
  const submit = useSubmit();
  const timerRef = useRef(0);
  const [selected, setSelected] = React.useState([]);

  return (
    <>
      <Navbar
        title="Memo"
        left={
          <Link to="/" className="aspect-square place-items-center">
            <BackIcon />
          </Link>
        }
      />

      <ScrollArea>
        <Suspense fallback={<LoaderScreen />}>
          <Await resolve={folder} errorElement={"server error"}>
            {(folder) => (
              <div className="flex gap-2 items-center px-2 mx-6 mt-4 border border-primary rounded focus:border-accent">
                <span>Folder:</span>
                <input
                  type="text"
                  spellCheck="false"
                  className="flex-1 py-1 font-bold bg-transparent outline-none"
                  defaultValue={folder?.title}
                  onChange={(ev) => {
                    submit(
                      {
                        _action: "update_folder",
                        title: ev.target.value,
                        folderId: params.id!,
                      },
                      {
                        method: "POST",
                        encType: "multipart/form-data",
                      }
                    );
                  }}
                />
              </div>
            )}
          </Await>
        </Suspense>

        <Suspense fallback={<LoaderScreen />}>
          <Await resolve={notes} errorElement={"server error"}>
            {(notes) => (
              <div id="notes-list">
                {notes.map((note: any) => (
                  <Form
                    id="main"
                    action="."
                    key={note.id}
                    method="POST"
                    className="notes-form m-5"
                  >
                    <div
                      className="grow-wrap text-base leading-[24px]"
                      data-replicated-value={note.note}
                    >
                      <textarea
                        id={note.id}
                        onKeyUp={(e) => {
                          clearTimeout(timerRef.current);
                          const elem = e.currentTarget.form!;
                          let id = setTimeout(() => {
                            const formData: any = Object.fromEntries(
                              new FormData(elem)
                            );

                            formData.folder_id = params.id;
                            formData.note_id = note.id;

                            submit(formData, {
                              method: "post",
                              replace: true,
                            });
                          }, 1000);
                          timerRef.current = id as unknown as number;
                        }}
                        onChange={(e) => {
                          e.currentTarget.parentElement!.dataset.replicatedValue =
                            e.currentTarget.value;
                        }}
                        name="note"
                        className="target gradiant rounded-sm w-full block outline-none"
                        style={{
                          backgroundColor: "#777",
                        }}
                        defaultValue={note.note}
                      />
                    </div>
                  </Form>
                ))}

                <Form method="POST" className="notes-form m-5">
                  <input type="hidden" name="folder_id" value={params.id} />
                  <input type="hidden" name="note" value="" />
                  <input type="hidden" name="_action" value="new_note" />
                  <button className="py-1.5 bg-primary rounded-sm w-full flex justify-center items-center">
                    Add New Note
                  </button>
                </Form>
              </div>
            )}
          </Await>
        </Suspense>
      </ScrollArea>
    </>
  );
}
