import CodeArea from "@/components/home/code_area";
import InputArea from "@/components/home/input_area";
import ClassGenerator from "@/utils/class_generator";
import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";

const Home = () => {
  const [fileName, setfileName] = useState("");
  const [apiMap, setapiMap] = useState("");
  const [hasGeneratedCode, sethasGeneratedCode] = useState(false);
  const [code, setcode] = useState("");
  const [isGeneratingCode, setisGeneratingCode] = useState(false);

  useEffect(() => {
    console.log("In useEffect");

    if (code.length > 0) {
      generateCode();
    }
  }, [code]);

  const generateCode = async () => {
    let api = {};
    const theApi = apiMap.replaceAll("'", '"').trim();
    console.log(theApi);

    try {
      sethasGeneratedCode(false);
      // await new Promise((resolve) => setTimeout(resolve, 300));
      api = JSON.parse(theApi);

      setcode(
        ClassGenerator.generateFreezedClass(fileName, {
          apiMap: api,
          className: null,
        })
      );
      sethasGeneratedCode(true);
    } catch (error) {
      let errorMessage =
        'The provided json format is not accepted eg: json = {"name": "Belema", "state":2, "hobbies": ["Gaming", "Programing"]}';
      let autoClose = 15000;
      if (error instanceof Error) {
        // errorMessage = error.message.replace('JSON.parse:', '');
        // autoClose = 20000;
      }
      toast.error(`${errorMessage}`, { autoClose });
    }
  };

  const copyToClipbaord = async () => {
    const autoClose = 3000;
    try {
      await navigator.clipboard.writeText(code);
      toast.success("Code succesfully copied to clipboard", { autoClose });
    } catch (error) {
      toast.error("An error occured trying to copy code", { autoClose });
    }
  };

  const downloadFile = async () => {
    const autoClose = 3000;
    const fileData = code;
    const blob = new Blob([fileData], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = `${fileName}.dart`;
    link.href = url;
    link.click();
    toast.success(`Downloaded ${fileName}.dart Succesfully`, { autoClose });
  };
  return (
    <div className="flex justify-center items-center h-screen w-screen bg-slate-500">
      <ToastContainer />
      <div className="bg-white rounded-[30px] h-full  max-h-[550px] w-full max-w-[800px]">
        <div className="py-2 px-2 w-full h-full">
          <div className="flex bg-sky-200 w-full h-full rounded-[25px] px-5 py-5 space-x-3">
            {/* Controll Area */}
            <div className="h-full space-y-5 pt-6 ">
              <div className="w-[50px] h-[50px] bg-red-300 rounded-full"></div>
              <div className="h-[70%] w-[50px] bg-white rounded-full shadow-2xl"></div>
            </div>

            {/* Text Area */}
            <InputArea
              fileName={fileName}
              setfileName={setfileName}
              setapiMap={setapiMap}
              generateCode={generateCode}
              isGeneratingCode={isGeneratingCode}
              code={code}
            />
            {/* Generated code area */}
            <CodeArea
            key={code}
              code={code}
              fileName={fileName}
              hasGeneratedCode={hasGeneratedCode}
              copyToClipbaord={copyToClipbaord}
              downloadFile={downloadFile}
              setisGeneratingCode={setisGeneratingCode}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
