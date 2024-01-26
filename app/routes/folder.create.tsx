import Navbar from "@/components/Navbar";
import { Folder } from "@/lib/api";
import { ActionFunction } from "@remix-run/node";
import { Form, Link, redirect, useNavigation } from "@remix-run/react";

export const action: ActionFunction = async ({ request }) => {
  try {
    const fd = await request.formData();
    const body = Object.fromEntries(fd);
    await new Promise((res) => setTimeout(res, 500));
    await Folder.createFolder(body);

    return redirect("/");
  } catch (err) {
    console.error(err);
    return new Response(undefined, {
      status: 400,
    });
  }
};

export default function FolderCreate() {
  const { state } = useNavigation();

  return (
    <>
      <Navbar
        left={
          <Link to="/" className="aspect-square place-items-center">
            Back
          </Link>
        }
        right={null}
        title="Create Folder"
      />

      <main className="py-4">
        <Form method="POST" action=".">
          <div className="flex flex-col gap-3 p-4">
            <input
              className="bg-primary rounded p-2"
              name="title"
              placeholder="title"
            />

            <button className="bg-accent font-bold uppercase rounded p-2">
              {state === "submitting" ? "Saving..." : "Save"}
            </button>
          </div>
        </Form>
      </main>
    </>
  );
}
