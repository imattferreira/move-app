// const config = {
//   DATABASE_URI: process.env.DATABASE_URI as string
// };
//
const config = {
  DATABASE_URI: process.env.RIDES_DATABASE_URI as string
};

if (!config.DATABASE_URI || typeof config.DATABASE_URI !== 'string') {
  console.error('ENV `DATABASE_URI` not setted');
}

export default config;
