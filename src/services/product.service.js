import { Product } from "../dao/product.factory.js";
import ProductRepository from "../repositories/product.repository.js";

export const ProdcutService = new ProductRepository( new Product )