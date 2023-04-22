class ClassGenerator {
  static generateFreezedClass(
    fileName,
    { apiMap, className, isOtherModel = false }
  ) {
    if (!className && fileName.length > 0) {
      const splitted = fileName.includes("_")
        ? fileName.split("_")
        : [fileName];
      let newClassName = "";
      for (let name of splitted) {
        newClassName += `${name[0].toUpperCase()}${name.replace(name[0], "")}`;
      }
      className = newClassName;
    }

    let keyNamePairs = "";
    let otherModels = [];
    if (apiMap != null) {
      for (let [key, value] of Object.entries(apiMap)) {
        keyNamePairs += jsStringToDartString(value, key, (isMap) =>
          isMap
            ? otherModels.push([key, [value]])
            : otherModels.push([key, value])
        );
      }
    }

    return `${
      isOtherModel
        ? ""
        : `
  import 'package:flutter/foundation.dart';
  import 'package:freezed_annotation/freezed_annotation.dart';
  
  part '${fileName}.freezed.dart';
  part '${fileName}.g.dart';
  `
    }
  
  @freezed
  class ${className} with _\$${className} {
  
    const factory ${className}({${keyNamePairs}}) = _${className};
  
    factory ${className}.fromJson(Map<String, Object?> json)
        => _\$${className}FromJson(json);
  }
  
  ${buildOtherModel(otherModels)}
  `;

    // buildOtherModel(otherModels);
  }
}

function buildOtherModel(otherModels) {
  let models = "";
  otherModels.forEach((modelMap) => {
    models += ClassGenerator.generateFreezedClass(`${modelMap[0]}_model`, {
      apiMap: modelMap[1][0],
      isOtherModel: true,
    });
  });
  return models;
}

function stringToCamelCase(val) {
  const splitted = val.split("_");
  let newVal = "";
  for (let name of splitted) {
    newVal +=
      splitted.indexOf(name) === 0
        ? name
        : `${name[0].toUpperCase()}${name.replace(name[0], "")}`;
  }
  return newVal;
}

function stringToUpperCamelCase(val) {
  const splitted = val.split("_");
  let newVal = "";
  for (let name of splitted) {
    newVal += `${name[0].toUpperCase()}${name.replace(name[0], "")}`;
  }
  return newVal;
}

function jsStringToDartString(value, key, func) {
  if (jsToDart(value) === "List<Map>") {
    func();
    return `@JsonKey(name: '${key}') List<${stringToUpperCamelCase(
      key
    )}Model>? ${stringToCamelCase(key)}, \n`;
    // otherModels.add(entry);
  } else if (jsToDart(value) == "Map") {
    func(true);
    return `@JsonKey(name: '${key}') ${stringToUpperCamelCase(
      key
    )}Model? ${stringToCamelCase(key)}, \n`;
  } else if (jsToDart(value) == null) {
    return `@JsonKey(name: '${key}') String? ${stringToCamelCase(key)}, \n`;
  } else {
    return `@JsonKey(name: '${key}') ${jsToDart(value)}? ${stringToCamelCase(
      key
    )}, \n`;
  }
}

function jsToDart(value) {
  if (value === null) {
    return "null";
  } else if (typeof value === "boolean") {
    return "bool";
  } else if (typeof value === "number") {
    return Number.isInteger(value) ? "int" : "double";
  } else if (typeof value === "string") {
    return "String";
  } else if (Array.isArray(value)) {
    if (value.length > 0) {
      return `List<${jsToDart(value[0])}>`;
    } else {
      return "List<dynamic>";
    }
  } else if (typeof value === "object") {
    return "Map";
  } else {
    return "dynamic";
  }
}

export default ClassGenerator;


