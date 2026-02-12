// Import depuis config.js pour centraliser toutes les données
import { config, getProductById as getProductByIdFromConfig } from '../config';

export const categories = config.categories;
export const featuredProducts = config.products;
export const getProductById = getProductByIdFromConfig;
