import Image from "next/image";

export function Brand({ dark = false }: { dark?: boolean }) {
  return (
    <span className={`brand ${dark ? "brand-dark" : ""}`}>
      <Image
        className="brand-logo"
        src="/dsn-group-logo.webp"
        alt="DSN Groups — DSN: Dream Starts Now"
        width={3592}
        height={2412}
        sizes={dark ? "180px" : "132px"}
        priority={!dark}
      />
    </span>
  );
}
