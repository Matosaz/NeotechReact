import InputMask from "react-input-mask";

 const Input = ({ value, onChange }) => {
  return <InputMask placeholder="___.___.___-__" mask="999.999.999-99" value={value} onChange={onChange}  />;
};


 const InputTel = ({ value, onChange }) => {
  return <InputMask placeholder="(__) ____-____" mask="(99) 99999-9999" value={value} onChange={onChange}  />;
}


const InputCep = ({ value, onChange }) => {
  return <InputMask placeholder="_____-___" mask="99999-999" value={value} onChange={onChange}  />;
}

export { Input, InputTel, InputCep };
