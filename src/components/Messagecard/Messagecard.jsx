export default function Messagecard({ ref, threads, ...props }) {
  return (
    <div
      ref={ref}
      className={`flex flex-col p-5 rounded-lg shadow-lg shadow-black max-w-7xl`}
    >
      <div className="flex flex-col gap-1">
        <span className="font-bold">{threads.pseudoAccount}</span>
        <span className="text-sm">{threads.message}</span>
      </div>
      <div className="w-7/12 h-[190px]">
        <img
          src={threads.image.other.home.front_default}
          alt="Image"
          className="w-max-[190px] h-[190px]"
        />
      </div>
    </div>
  );
}
