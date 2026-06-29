import { AnimalIcon, FibromyalgiaIcon, OncologyIcon, AutismIcon, SecurityIcon, ChristianIcon } from "../components/CauseIcons";
import type { CauseLink } from "../types";

export const CAUSES: CauseLink[] = [
  {
    label: "Causa Animal",
    url: "https://www.instagram.com/thiagoganem.mg/",
    icon: AnimalIcon({}),
  },
  {
    label: "Autismo",
    url: "https://www.instagram.com/thiagoganem.autismo/",
    icon: AutismIcon({}),
  },
  {
    label: "Fibromialgia",
    url: "https://www.instagram.com/thiagoganem.fibromialgia/",
    icon: FibromyalgiaIcon({}),
  },
  {
    label: "Combate à pedofilia",
    url: "https://www.instagram.com/thiagoganem_mg/",
    icon: SecurityIcon({}),
  },
  {
    label: "Cristão",
    url: "https://www.instagram.com/thiagoganem.cristao/",
    icon: ChristianIcon({}),
  },
  {
    label: "Oncologia",
    url: "https://www.instagram.com/thiagoganem.oncologia/",
    icon: OncologyIcon({}),
  },
];

export const INSTAGRAM_PROFILE = {
  label: "Conheça o Thiago",
  url: "https://www.instagram.com/thi.ganem",
};
