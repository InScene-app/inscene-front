import { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Typography, Box, Stack, CircularProgress, InputBase, IconButton, useMediaQuery } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import EventIcon from '@mui/icons-material/Event';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import { usePageLayout } from '../hooks/usePageLayout';
import AnnouncementCard from '../components/announcement/AnnouncementCard';
import AnnouncementDetailPanel from '../components/announcement/AnnouncementDetailPanel';
import { getAnnouncements, searchAnnouncements } from '../api/announcementService';
import { getFollowingIds } from '../api/userService';
import { parseJwt } from '../utils/jwt';
import { Announcement, ContractType } from '../types/announcement';
import { useFavorites } from '../hooks/useFavorites';

type FilterType = 'a_venir' | 'missions' | 'reseaux';

const FILTERS: { key: FilterType; label: string; icon: React.ElementType }[] = [
  { key: 'a_venir', label: 'A venir', icon: EventIcon },
  { key: 'missions', label: 'Missions', icon: WorkOutlineIcon },
  { key: 'reseaux', label: 'Réseaux', icon: PeopleOutlineIcon },
];

// Contract types par filtre
const FILTER_CONTRACTS: Record<string, ContractType[]> = {
  a_venir: [ContractType.STAGE, ContractType.ALTERNANCE],
  missions: [ContractType.PRESTATION, ContractType.BENEVOLAT],
};

export default function Home() {
  usePageLayout();
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const { isSaved, toggleSave } = useFavorites();
  const [searchParams] = useSearchParams();
  const [allAnnouncements, setAllAnnouncements] = useState<Announcement[]>([]);
  const [displayedAnnouncements, setDisplayedAnnouncements] = useState<Announcement[]>([]);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [activeFilter, setActiveFilter] = useState<FilterType | null>(null);
  const [followingIds, setFollowingIds] = useState<number[]>([]);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto-select first announcement on desktop
  useEffect(() => {
    if (isDesktop && displayedAnnouncements.length > 0) {
      setSelectedAnnouncement(prev =>
        prev && displayedAnnouncements.find(a => a.id === prev.id) ? prev : displayedAnnouncements[0]
      );
    }
  }, [isDesktop, displayedAnnouncements]);

  // Load all announcements on mount
  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        setLoading(true);
        const data = await getAnnouncements();
        setAllAnnouncements(data);
        const q = searchParams.get('q') || '';
        if (!q) {
          setDisplayedAnnouncements(data);
        }
        setError(null);
      } catch (err) {
        console.error('Erreur lors du chargement des annonces:', err);
        setError('Impossible de charger les annonces');
      } finally {
        setLoading(false);
      }
    };
    fetchAnnouncements();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // React to URL query changes (navbar search)
  useEffect(() => {
    const q = searchParams.get('q') || '';
    setSearchQuery(q);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    performSearch(q);
  }, [searchParams]); // eslint-disable-line react-hooks/exhaustive-deps

  // Load following IDs for "Réseaux" filter
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const payload = token ? parseJwt(token) : null;
    const userId = payload?.sub as number | undefined;
    if (userId) {
      getFollowingIds(userId).then(setFollowingIds).catch(() => { });
    }
  }, []);

  // Apply search
  const performSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      // Reset to all (with active filter applied)
      applyFilter(activeFilter, allAnnouncements);
      return;
    }
    try {
      setLoading(true);
      const results = await searchAnnouncements(query.trim());
      // If a filter is also active, apply it on search results
      applyFilter(activeFilter, results);
    } catch {
      setError('Erreur lors de la recherche');
    } finally {
      setLoading(false);
    }
  }, [activeFilter, allAnnouncements, followingIds]);

  // Apply filter on a set of announcements
  const applyFilter = useCallback((filter: FilterType | null, announcements: Announcement[]) => {
    if (!filter) {
      setDisplayedAnnouncements(announcements);
      return;
    }

    if (filter === 'reseaux') {
      setDisplayedAnnouncements(
        announcements.filter(a => a.author?.id && followingIds.includes(a.author.id))
      );
    } else {
      const contracts = FILTER_CONTRACTS[filter] || [];
      setDisplayedAnnouncements(
        announcements.filter(a => contracts.includes(a.contractType))
      );
    }
  }, [followingIds]);

  // Debounced search on input change
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      performSearch(value);
    }, 400);
  };

  // Search on Enter or click
  const handleSearchSubmit = () => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    performSearch(searchQuery);
  };

  // Toggle filter
  const handleFilterToggle = async (key: FilterType) => {
    const newFilter = activeFilter === key ? null : key;
    setActiveFilter(newFilter);

    // Get the base dataset (search results or all)
    const base = searchQuery.trim()
      ? await searchAnnouncements(searchQuery.trim()).catch(() => allAnnouncements)
      : allAnnouncements;

    applyFilter(newFilter, base);
  };

  return (
    <Box sx={isDesktop ? { display: 'flex', flexDirection: 'column', height: 'calc(100vh - 96px)' } : {}}>
      {/* Header */}
      <Box sx={{ flexShrink: 0 }}>
        <Typography
          sx={{
            fontFamily: 'Quicksand, sans-serif',
            fontSize: '38px',
            fontWeight: 600,
            mb: 0.5,
          }}
        >
          InScène
        </Typography>
        <Typography
          sx={{
            fontSize: '24px',
            fontWeight: 500,
            color: 'text.secondary',
            mb: 3,
          }}
        >
          Vous rêvez, nous connectons
        </Typography>

        {/* Search bar - mobile only */}
        {!isDesktop && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              borderRadius: '70px',
              backgroundColor: 'background.paper',
              boxShadow: '0 3px 6px 0 rgba(83, 82, 104, 0.10)',
              border: (theme) => theme.palette.mode === 'dark' ? '1px solid' : '1px solid transparent',
              borderColor: 'background.border',
              px: 2.5,
              py: 0.5,
              mb: 3,
            }}
          >
            <InputBase
              placeholder="CDD monteur à Lyon"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSearchSubmit(); }}
              sx={{
                flex: 1,
                fontSize: '15px',
                '& .MuiInputBase-input': {
                  py: 1.2,
                },
              }}
            />
            <IconButton onClick={handleSearchSubmit} sx={{ p: 0.5 }}>
              <SearchIcon sx={{ color: 'primary.main', fontSize: 26 }} />
            </IconButton>
          </Box>
        )}

        {/* Filter toggles */}
        <Stack direction="row" spacing={1.5} sx={{ mb: 4 }}>
          {FILTERS.map(({ key, label, icon: Icon }) => {
            const isActive = activeFilter === key;
            return (
              <Box
                key={key}
                onClick={() => handleFilterToggle(key)}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.8,
                  borderRadius: '60px',
                  backgroundColor: isActive ? 'background.default' : 'background.paper',
                  color: 'text.primary',
                  border: '1px solid',
                  borderColor: 'background.border',
                  px: 2,
                  py: 1,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  userSelect: 'none',
                  '&:hover': {
                    backgroundColor: isActive ? 'background.default' : 'background.hover',
                  },
                }}
              >
                <Icon sx={{ fontSize: 20 }} />
                <Typography sx={{ fontSize: '14px', fontWeight: 600, whiteSpace: 'nowrap' }}>
                  {label}
                </Typography>
              </Box>
            );
          })}
        </Stack>
      </Box>{/* end header */}

      {/* Content */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '30vh' }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : displayedAnnouncements.length === 0 ? (
        <Typography color="text.secondary" sx={{ textAlign: 'center', mt: 4 }}>
          {searchQuery.trim() || activeFilter
            ? 'Aucun résultat trouvé'
            : 'Aucune annonce disponible'}
        </Typography>
      ) : isDesktop ? (
        <Box sx={{ display: 'flex', gap: 3, flex: 1, overflow: 'hidden' }}>
          {/* Left: scrollable list */}
          <Box sx={{ width: '43%', flexShrink: 0, height: '100%', overflowY: 'auto', pr: 1, scrollbarWidth: 'none', '&::-webkit-scrollbar': { display: 'none' } }}>
            <Stack spacing="20px">
              {displayedAnnouncements.map((announcement) => (
                <AnnouncementCard
                  key={announcement.id}
                  announcement={announcement}
                  isSaved={isSaved(announcement.id)}
                  onToggleSave={toggleSave}
                  isSelected={selectedAnnouncement?.id === announcement.id}
                  onSelect={setSelectedAnnouncement}
                  sx={{ boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}
                />
              ))}
            </Stack>
          </Box>

          {/* Right: detail panel */}
          <Box
            sx={{
              flex: 1,
              bgcolor: 'background.paper',
              borderRadius: '24px',
              border: '1px solid',
              borderColor: 'background.border',
              height: '100%',
              overflowY: 'auto',
            }}
          >
            {selectedAnnouncement ? (
              <AnnouncementDetailPanel
                announcement={selectedAnnouncement}
                isSaved={isSaved(selectedAnnouncement.id)}
                onToggleSave={() => toggleSave(selectedAnnouncement.id)}
              />
            ) : (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
                <Typography color="text.secondary">Sélectionnez une annonce</Typography>
              </Box>
            )}
          </Box>
        </Box>
      ) : (
        <Stack spacing="35px">
          {displayedAnnouncements.map((announcement) => (
            <AnnouncementCard
              key={announcement.id}
              announcement={announcement}
              isSaved={isSaved(announcement.id)}
              onToggleSave={toggleSave}
            />
          ))}
        </Stack>
      )}
    </Box>
  );
}
