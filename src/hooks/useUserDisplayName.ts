import { useEffect, useState } from 'react';

export function useUserDisplayName() {
  const [displayName, setDisplayName] = useState('');

  useEffect(() => {
    fetch('/api/user-display-name')
      .then(async res => {
        if (!res.ok) return;
        try {
          const data = await res.json();
          if (data.display_name) {
            setDisplayName(data.display_name);
          }
        } catch {
          // Ignore JSON parse errors
        }
      });
  }, []);

  return displayName;
}
