import React from 'react';
import { motion } from 'framer-motion';

const LoadingSkeletons = () => {
  const skeletonVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
  };

  const shimmer = {
    initial: { backgroundPosition: '1000px 0' },
    animate: {
      backgroundPosition: '-1000px 0',
      transition: {
        repeat: Infinity,
        duration: 2,
        ease: 'linear',
      },
    },
  };

  return (
    <motion.div
      variants={skeletonVariants}
      initial="initial"
      animate="animate"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {[...Array(6)].map((_, idx) => (
        <motion.div
          key={idx}
          variants={itemVariants}
          className="bg-gradient-to-br bg-white dark:from-slate-700 dark:to-slate-800 rounded-2xl overflow-hidden border dark:border-slate-600/50 h-96"
        >
          {/* Image Skeleton */}
          <motion.div
            variants={shimmer}
            animate="animate"
            className="h-56 bg-gradient-to-r from-gray-50 via-gray-100 to-gray-200 dark:from-slate-700 dark:via-slate-600 dark:to-slate-700 bg-[length:1000px_100%]"
          />

          {/* Content Skeleton */}
          <div className="p-4 space-y-4">
            {/* Title */}
            <motion.div
              variants={shimmer}
              animate="animate"
              className="h-4 bg-gradient-to-r from-gray-50 via-gray-100 to-gray-200 dark:from-slate-700 dark:via-slate-600 dark:to-slate-700 bg-[length:1000px_100%] rounded w-3/4"
            />
            <motion.div
              variants={shimmer}
              animate="animate"
              className="h-3 bg-gradient-to-r from-gray-50 via-gray-100 to-gray-200 dark:from-slate-700 dark:via-slate-600 dark:to-slate-700 bg-[length:1000px_100%] rounded w-1/2"
            />

            {/* Badges */}
            <div className="flex gap-2">
              <motion.div
                variants={shimmer}
                animate="animate"
                className="h-6 w-12 bg-gradient-to-r from-gray-50 via-gray-100 to-gray-200 dark:from-slate-700 dark:via-slate-600 dark:to-slate-700 bg-[length:1000px_100%] rounded"
              />
              <motion.div
                variants={shimmer}
                animate="animate"
                className="h-6 w-12 bg-gradient-to-r from-gray-50 via-gray-100 to-gray-200 dark:from-slate-700 dark:via-slate-600 dark:to-slate-700 bg-[length:1000px_100%] rounded"
              />
            </div>

            {/* Prices */}
            <div className="space-y-2">
              <motion.div
                variants={shimmer}
                animate="animate"
                className="h-3 bg-gradient-to-r from-gray-50 via-gray-100 to-gray-200 dark:from-slate-700 dark:via-slate-600 dark:to-slate-700 bg-[length:1000px_100%] rounded"
              />
              <motion.div
                variants={shimmer}
                animate="animate"
                className="h-3 bg-gradient-to-r from-gray-50 via-gray-100 to-gray-200 dark:from-slate-700 dark:via-slate-600 dark:to-slate-700 bg-[length:1000px_100%] rounded w-4/5"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-2">
              <motion.div
                variants={shimmer}
                animate="animate"
                className="flex-1 h-8 bg-gradient-to-r from-gray-50 via-gray-100 to-gray-200 dark:from-slate-700 dark:ia-slate-600 dark:to-slate-700 bg-[length:1000px_100%] rounded-lg"
              />
              <motion.div
                variants={shimmer}
                animate="animate"
                className="flex-1 h-8 bg-gradient-to-r from-gray-50 via-gray-100 to-gray-200 dark:from-slate-700 dark:via-slate-600 dark:to-slate-700 bg-[length:1000px_100%] rounded-lg"
              />
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default LoadingSkeletons;