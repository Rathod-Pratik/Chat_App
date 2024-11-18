import { HOST } from "@/utils/Constants" ;
import   axios  from "axios";

export const apiClient =axios.create({
    baseURL:HOST
})