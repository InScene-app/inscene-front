import { useEffect } from 'react';
import { useLayout } from '../contexts/LayoutContext';

/**
 * Hook pour configurer le layout de la page
 * @param {Object} options - Options de configuration
 * @param {string|false} options.maxWidth - Largeur max du container ('xs' | 'sm' | 'md' | 'lg' | 'xl' | false pour full-width)
 * @param {boolean} options.disableGutters - Désactiver les marges internes du container
 */
export const usePageLayout = ({ maxWidth = 'lg', disableGutters = false } = {}) => {
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
