type SizeProps = {
  size: number;
};

export default function Logo({ size }: SizeProps) {
  return (
    <div className="flex">
      <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width={size} height={size} viewBox="0 0 24 24">
        <path d="M10.053,7.988l5.631,8.024h-1.497L8.566,7.988H10.053z M21,21H3V3h18V21z M17.538,17l-4.186-5.99L16.774,7h-1.311l-2.704,3.16L10.552,7H6.702l3.941,5.633L6.906,17h1.333l3.001-3.516L13.698,17H17.538z"></path>
      </svg>
    </div>
  );
}
