"use client";

import { useCallback, useRef } from "react";
import { getAnatomyStructure } from "@/lib/anatomy";
import type { AnatomyAssistAction } from "@/lib/anatomy/assist-actions";
import type { AnatomyLayer, AnatomySystem } from "@/lib/anatomy/types";

export type AnatomyAssistBridge = {
  executeActions: (actions: AnatomyAssistAction[]) => void;
};

type Options = {
  onSelectStructure: (id: string) => void;
  onToggleLayer: (layer: AnatomyLayer) => void;
  onSetSystemFilter: (system: AnatomySystem | "all") => void;
  onResetView: () => void;
  visibleLayers: Set<AnatomyLayer>;
};

export function useAnatomyAssistBridge({
  onSelectStructure,
  onToggleLayer,
  onSetSystemFilter,
  onResetView,
  visibleLayers,
}: Options): AnatomyAssistBridge {
  const visibleRef = useRef(visibleLayers);
  visibleRef.current = visibleLayers;

  const executeActions = useCallback(
    (actions: AnatomyAssistAction[]) => {
      for (const action of actions) {
        switch (action.type) {
          case "select_structure":
            if (getAnatomyStructure(action.structureId)) {
              onSelectStructure(action.structureId);
            }
            break;
          case "toggle_layer": {
            const isOn = visibleRef.current.has(action.layer);
            if (action.visible !== isOn) onToggleLayer(action.layer);
            break;
          }
          case "set_system_filter":
            onSetSystemFilter(action.system);
            break;
          case "reset_view":
            onResetView();
            break;
        }
      }
    },
    [onResetView, onSelectStructure, onSetSystemFilter, onToggleLayer]
  );

  return { executeActions };
}
