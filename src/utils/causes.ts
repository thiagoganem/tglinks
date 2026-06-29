import { AnimalIcon, FibromyalgiaIcon, OncologyIcon, AutismIcon, SecurityIcon } from "../components/CauseIcons";
import type { CauseLink } from "../types";

export const CAUSES: CauseLink[] = [
  {
    label: "Causa Animal",
    url: "https://www.instagram.com/thiagoganem.mg/",
    icon: AnimalIcon({}),
  },
  {
    label: "Fibromialgia",
    url: "https://www.instagram.com/thiagoganem.fibromialgia/",
    icon: FibromyalgiaIcon({}),
  },
  {
    label: "Oncologia",
    url: "https://www.instagram.com/thiagoganem.oncologia/",
    icon: OncologyIcon({}),
  },
  {
    label: "Autismo",
    url: "https://www.instagram.com/thiagoganem.autismo/",
    icon: AutismIcon({}),
  },
  {
    label: "Cristão",
    url: "https://www.instagram.com/thiagoganem_mg/",
    icon: SecurityIcon({}),
  },
  {
    label: "Combate à pedofilia",
    url: "https://www.instagram.com/thiagoganem_mg/",
    icon: SecurityIcon({}),
  },
];

export const INSTAGRAM_PROFILE = {
  label: "Conheça o Thiago",
  url: "https://www.instagram.com/thiagoganem.cristao",
};
