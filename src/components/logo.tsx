type SizeProps = {
  size: number;
};

export default function Logo({ size }: SizeProps) {
  return <img src="/hamburger.svg" alt="hamburger" width={size} className="logo" />;
}
