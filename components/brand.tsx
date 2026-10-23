import Image from "next/image";

export function Brand({ dark = false }: { dark?: boolean }) {
  return (
    <span className={`brand ${dark ? "brand-dark" : ""}`}>
      <Image
        className="brand-logo"
        src={dark ? "/ajfan-logo-transparent.webp" : "/ajfan-logo.webp"}
        alt="AJFAN Documents Clearing"
        width={5100}
        height={3111}
        sizes={dark ? "180px" : "132px"}
        priority={!dark}
      />
    </span>
  );
}
