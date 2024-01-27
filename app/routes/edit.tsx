import FolderCard from "@/components/FolderCard";
import Navbar from "@/components/Navbar";
import { ScrollArea } from "@/components/ScrollArea";
import { Folder } from "@/lib/api";
import { cn } from "@/lib/utils";
import { ActionFunction } from "@remix-run/node";
import {
  Link,
  json,
  redirect,
  useFetcher,
  useLoaderData,
} from "@remix-run/react";
import * as React from "react";

// GET
export const loader = async () => {
  const folderList = await Folder.getAll();

  return json({
    folderList,
  });
};

// POST
export const action: ActionFunction = async ({ request }) => {
  const body: { folderList: string[] } = await request.json();
  await Folder.deleteFolders(body);

  return redirect("/");
};

// CLIENT
const reducer = (
  state = [] as string[],
  action: { type: "toggle"; payload: { id: string } }
) => {
  switch (action.type) {
    case "toggle": {
      if (state.includes(action.payload.id))
        return state.filter((_id) => _id !== action.payload.id);
      else return state.concat(action.payload.id);
    }
  }
};

export default function DeletePage() {
  const { folderList } = useLoaderData<typeof loader>();
  const [selected, dispatch] = React.useReducer(reducer, []);
  const fetcher = useFetcher();

  return (
    <>
      <Navbar
        left={
          <button
            type="button"
            onClick={() => {
              fetcher.submit(
                { folderList: selected },
                {
                  action: "/edit",
                  encType: "application/json",
                  method: "POST",
                }
              );
            }}
          >
            Delete
          </button>
        }
        title="Edit folder"
        right={
          <Link to="/" className="text-right" replace>
            Cancel
          </Link>
        }
      />

      <ScrollArea className="max-h-[calc(100dvh-var(--app-bar))] overflow-y-scroll">
        {selected.length === 0 ? (
          <p className="px-6 pt-4 font-bold  text-primary">No Item Selected</p>
        ) : (
          <p className="px-6 pt-4 font-bold">Selected: {selected.length}</p>
        )}

        {folderList.map((folder) => (
          <button
            key={folder.id}
            onClick={() =>
              dispatch({ type: "toggle", payload: { id: folder.id } })
            }
            className="!block w-full"
          >
            <FolderCard
              className={cn(
                "border-transparent border-2 !my-2",
                selected.includes(folder.id) && "!border-purple-500"
              )}
              title={folder.title}
              last_note={undefined}
              last_updated_at={undefined}
            />
          </button>
        ))}
      </ScrollArea>
    </>
  );
}
