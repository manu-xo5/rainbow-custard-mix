import FolderCard from "@/components/FolderCard";
import { LoaderScreen } from "@/components/LoaderScreen";
import Navbar from "@/components/Navbar";
import { ScrollArea } from "@/components/ScrollArea";
import AddIcon from "@/icons/AddIcon";
import { Folder } from "@/lib/api";
import { defer } from "@remix-run/node";
import { Await, Link, useLoaderData } from "@remix-run/react";
import { Suspense } from "react";

export const loader = async () => {
  const folders = Folder.getAll();
  return defer({
    folders,
  });
};

export default function Index() {
  const { folders } = useLoaderData<typeof loader>();

  return (
    <>
      <Navbar
        left={
          <Link
            to="/folder/create"
            className="aspect-square place-items-center"
          >
            <AddIcon />
          </Link>
        }
        right={
          <Link to="/edit" className="aspect-square place-items-center">
            Edit
          </Link>
        }
        title="Memo"
      />

      <Suspense fallback={<LoaderScreen />}>
        <Await resolve={folders}>
          {(folders) => (
            <ScrollArea>
              {folders.map((folderItem) => (
                <Link key={folderItem.id} to={`folder/${folderItem.id}/notes/`}>
                  <FolderCard {...folderItem} last_note={folderItem.note} />
                </Link>
              ))}
            </ScrollArea>
          )}
        </Await>
      </Suspense>
    </>
  );
}
