import { motion } from "framer-motion";

const MatrixLoader = () => {
  return (
    <div className="matrix-loader fixed inset-0 flex items-center justify-center bg-black z-[1000]">
      <motion.div
        className="matrix-loader-ring"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
      />
    </div>
  );
};

export default MatrixLoader;
