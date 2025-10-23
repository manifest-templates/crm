import { createEntityClient } from "../utils/entityWrapper";
import schema from "./Customer.json";
export const Customer = createEntityClient("Customer", schema);
