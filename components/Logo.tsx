import Link from "next/link"

const Logo = () => {
  return (
    <Link href="/">
      <span className="font-semibold bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent text-2xl">
        Transcrire
      </span>
    </Link>
  );
}

export default Logo