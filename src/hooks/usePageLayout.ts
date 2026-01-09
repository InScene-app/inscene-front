import { useEffect } from 'react';
import { useLayout } from '../contexts/LayoutContext';
import { Breakpoint } from '@mui/material';

type ContainerMaxWidth = Breakpoint | false;

interface UsePageLayoutOptions {
  maxWidth?: ContainerMaxWidth;
  disableGutters?: boolean;
}

/**
 * Hook pour configurer le layout de la page
 * @param options - Options de configuration
 * @param options.maxWidth - Largeur max du container ('xs' | 'sm' | 'md' | 'lg' | 'xl' | false pour full-width)
 * @param options.disableGutters - Désactiver les marges internes du container
 */
export const usePageLayout = ({ maxWidth = 'lg', disableGutters = false }: UsePageLayoutOptions = {}) => {
  const { setContainerMaxWidth, setDisableGutters } = useLayout();

  useEffect(() => {
    setContainerMaxWidth(maxWidth);
    setDisableGutters(disableGutters);

    // Reset au démontage
    return () => {
      setContainerMaxWidth('lg');
      setDisableGutters(false);
    };
  }, [maxWidth, disableGutters, setContainerMaxWidth, setDisableGutters]);
};
