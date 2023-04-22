import { AnimatePresence, motion } from "framer-motion";
import { useRef, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { FiCopy } from "react-icons/fi";

const appp = {
  name: "heell",
  canem: [{ bills: "", sinf: [{ bless: 77 }] }],
};

interface InputAreaInterface {
  fileName: string;
  setfileName: React.Dispatch<React.SetStateAction<string>>;
  setapiMap: React.Dispatch<React.SetStateAction<string>>;
  generateCode: () => void;
  isGeneratingCode: boolean;
  code: string;
}

const InputArea = ({
  fileName,
  setfileName,
  setapiMap,
  generateCode,
  isGeneratingCode,
  code,
}: InputAreaInterface): JSX.Element => {
  const [proceed, setproceed] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const getApi = () => {
    if (fileName.length < 1) {
      toast.warn("please input a valid file name");
      return;
    }
    if (inputRef.current !== null) {
      inputRef.current.value = "";
    }
    setproceed(true);
  };
  const command =
    "flutter pub run build_runner build --delete-conflicting-outputs";
  const copyCommand = async () => {
    const autoClose = 3000;
    const position= "bottom-center"
    try {
      await navigator.clipboard.writeText(command);
      toast.success("Command succesfully copied to clipboard", {
        autoClose,
        position,
      });
    } catch (error) {
      toast.error("An error occured trying to copy code", { autoClose , position});
    }
  };
  return (
    <div className="w-full flex flex-col justify-center items-start space-y-3 relative h-full">
      <ToastContainer />

      {isGeneratingCode ? (
        <div className="w-full  grid place-items-center">
          <div className="w-9 h-9 rounded-full border-4 border-blue-800 border-r-transparent animate-spin"></div>
        </div>
      ) : !isGeneratingCode && code.length > 0 ? (
        <motion.div
          key={"text 1"}
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -20, opacity: 0 }}
          className="px-5"
        >
          <p className="text-blue-800 text-[30px] font-semibold leading-8 pb-3">
            Your model class is ready
          </p>
          <div className="bg-black px-2 py-2 rounded-md bg-opacity-25 flex space-x-2 border">
            <p className=" text-slate-600 text-xs ">
              run <span className="text-red-500 font-medium">{command}</span> on
              your terminal navigated to your project path
            </p>
            <button className="w-5" onClick={copyCommand}>
              <FiCopy />
            </button>
          </div>
        </motion.div>
      ) : (
        <AnimatePresence mode="wait">
          {!proceed ? (
            <motion.div
              key={"text 1"}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              className="px-5"
            >
              <p className="text-blue-800 text-[30px] font-semibold leading-8 pb-3">
                Enter your file name
              </p>
              <p className=" text-slate-600 text-xs">without .dart extension</p>
            </motion.div>
          ) : (
            <motion.div
              key={"text 2"}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              className="px-5"
            >
              <p className="text-blue-800 text-[30px] font-semibold leading-8 pb-3">
                Paste in your api map
              </p>
              <p className=" text-slate-600 text-xs">
                A model class would be generated for you
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      <div className="px-4 w-full  absolute bottom-[30px]">
        <div className="h-[55px] border-dashed border border-[green] rounded-full flex items-center">
          <input
            ref={inputRef}
            className="rounded-full h-full w-[80%] outline-none bg-transparent px-4 text-slate-600 text-xs"
            onChange={(e) =>
              !proceed ? setfileName(e.target.value) : setapiMap(e.target.value)
            }
          />
          <div className="w-[10px]"></div>
          <button
            className="h-[40px] w-[40px] rounded-full shadow-xl  bg-sky-500 hover:scale-95 active:scale-105 transition-all duration-300"
            onClick={!proceed ? getApi : generateCode}
          >
            {!proceed ? "F" : "A"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InputArea;
