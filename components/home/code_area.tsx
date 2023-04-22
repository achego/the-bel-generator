import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { FiCopy, FiDownload } from "react-icons/fi";
import { RiArrowUpSLine } from "react-icons/ri";
import { HiQrcode } from "react-icons/hi";
import SyntaxHighlighter from "react-syntax-highlighter";

interface CodeAreaProps {
  code: string;
  fileName: string;
  hasGeneratedCode: boolean;
  copyToClipbaord: () => void;
  downloadFile: () => void;
  setisGeneratingCode: React.Dispatch<React.SetStateAction<boolean>>;
}
const CodeArea = ({
  code,
  fileName,
  hasGeneratedCode = true,
  copyToClipbaord,
  setisGeneratingCode,
  downloadFile,
}: CodeAreaProps) => {
  const [text, settext] = useState("");
  const count = useRef(0);
  useEffect(() => {
    setisGeneratingCode(true);
    if (count.current >= code.length) {
      setisGeneratingCode(false);
      return;
    }
    const timer = setTimeout(() => {
      settext(text + code[count.current]);
      count.current++;
    }, 2);

    return () => {
      clearTimeout(timer);
    };
  }, [text]);

  return (
    <div className="w-full h-full bg-blue-300 rounded-[15px] px-4 py-4  text-xs shadow-lg border  flex flex-col overflow-auto">
      <AnimatePresence>
        {hasGeneratedCode || code.length > 10 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-full overflow-auto"
          >
            <SyntaxHighlighter
              language="dart"
              // wrapLines={true}
              wrapLongLines={true}
              customStyle={{
                background: "transparent",
                wordWrap: "break-word",
                width: "100%",
                height: "100%",
              }}
            >
              {text}
            </SyntaxHighlighter>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-full flex flex-col"
          >
            <div className="h-[100px] w-full bg-white bg-opacity-30 px-3 py-3 rounded-xl flex flex-col justify-evenly space-y-2 text-sky-600">
              <div className="flex justify-between">
                <p className="font-semibold">FILE NAME</p>
                <RiArrowUpSLine className="font-bold w-4 h-4 "/>
                {/* <span className="-rotate-90 font-bold"> {">"}</span> */}
              </div>
              <div className="flex justify-between">
                {[0, 1, 2, 3, 4].map((num) => (
                  <div
                    key={num}
                    className="h-10 w-10 rounded-md bg-white bg-opacity-30 p-2"
                  >
                    <HiQrcode className="w-full h-full" />
                  </div>
                ))}
              </div>
            </div>
            <div className="flex-grow grid place-items-center">
              <AnimatePresence>
                {fileName.length > 0 && (
                  <motion.p
                    key={"fileName"}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                    // transition={{ duration:  }}
                    className="text-blue-800 text-[30px] font-semibold leading-8 pb-3"
                  >{`${fileName}.dart`}</motion.p>
                )}
              </AnimatePresence>
            </div>
            <div className="space-y-3">
              <div className="h-[50px] w-full bg-white bg-opacity-30 px-3 py-3 rounded-xl flex flex-col justify-evenly space-y-2 text-sky-600">
                <div className="flex justify-between">
                  <p className="font-semibold">SHAPES AND COLORS</p>

                  {/* <span className="rotate-180 font-bold w-4 h-4 border"> */}
                    <RiArrowUpSLine className="rotate-180 font-bold w-4 h-4 "/>
                  {/* </span> */}
                </div>
              </div>
              <div className="h-[50px] w-full bg-white bg-opacity-30 px-3 py-3 rounded-xl flex flex-col justify-evenly space-y-2 text-sky-600">
                <div className="flex justify-between">
                  <p className="font-semibold">LOADS</p>
                  <RiArrowUpSLine className="rotate-180 font-bold w-4 h-4 "/>
                  {/* <span className="rotate-90 font-bold"> {">"}</span> */}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* </div> */}
      <div className=" h-[40px] mt-2 flex space-x-5 px-6">
        <button
          className="w-full h-[40px] bg-sky-600 rounded-full  font-medium shadow-lg active:scale-95 transition-all flex justify-center items-center space-x-3"
          onClick={code.length < 1 ? () => {} : copyToClipbaord}
        >
          <div className="pr-2">
            <FiCopy />
          </div>
          Copy
        </button>
        <button
          className="w-full h-[40px] bg-yellow-500 rounded-full  font-medium shadow-lg active:scale-95 transition-all flex justify-center items-center space-x-3"
          onClick={code.length < 1 ? () => {} : downloadFile}
        >
          <div className="pr-2">
            <FiDownload />
          </div>
          Download file
        </button>
      </div>
    </div>
  );
};

export default CodeArea;
