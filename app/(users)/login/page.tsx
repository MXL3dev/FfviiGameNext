import Link from "next/link";
import { login } from "./actions";
import { Suspense } from "react";

async function MessageErreur({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  if (!error) return null;
  return <p>Email ou mot de passe incorrect</p>;
}

export default async function logIn({
   searchParams,
    }: {
      searchParams: Promise<{ error?: string }>;
    }) {

  return (
    <div className="login">
      <form action={login}>
        <input type="email" name="email" id="" /><br />
        <input type="password" name="password" id="" /><br />
        <input type="submit" value="connexion" />
        <Suspense fallback={null}>
          <MessageErreur searchParams={searchParams} />
        </Suspense>
      </form>
    </div>
    
  );
}