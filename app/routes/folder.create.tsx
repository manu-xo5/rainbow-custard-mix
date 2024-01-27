import Navbar from "@/components/Navbar";
import { Folder } from "@/lib/api";
import { ActionFunction } from "@remix-run/node";
import { Form, Link, redirect, useNavigation } from "@remix-run/react";

export const action: ActionFunction = async ({ request }) => {
  try {
    const fd = await request.formData();
    const title = fd.get("title")?.toString();

    if (!title) {
      throw new Error("title isn't type of string | number");
    }

    await Folder.createFolder({ title });

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
