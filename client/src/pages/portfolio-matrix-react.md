# Portfolio z efektami w stylu Matrix zbudowane przy użyciu React

W tym artykule pokażę, jak stworzyć portfolio z efektami inspirowanymi filmem Matrix, wykorzystując React i nowoczesne biblioteki front-endowe. Projekt zawiera animowane menu, efekt "padającego kodu" oraz wiele innych interaktywnych elementów.

## Użyte technologie

- **React** - główna biblioteka do budowy interfejsu ([Dokumentacja](https://react.dev))
- **Tailwind CSS** - utility-first framework CSS ([Dokumentacja](https://tailwindcss.com))
- **Framer Motion** - biblioteka do animacji ([Dokumentacja](https://www.framer.com/motion/))
- **EmailJS** - wysyłanie maili bez backendu ([Dokumentacja](https://www.emailjs.com/docs/))
- **Wouter** - lekki router dla React ([Dokumentacja](https://github.com/molefrog/wouter))

## Struktura projektu

Projekt jest podzielony na kilka głównych komponentów:

```
src/
├── features/
│   ├── articles/
│   ├── home/
│   ├── projects/
│   └── skills/
├── shared/
│   └── components/
│       ├── common/
│       │   ├── MatrixRain.tsx
│       │   ├── TextReveal.tsx
│       │   └── LanguageContext.tsx
│       └── layout/
│           └── Sidebar.tsx
└── App.tsx
```

## Główne efekty Matrix

### 1. Efekt padającego kodu (MatrixRain)

Najbardziej charakterystyczny efekt to "padający kod" Matrix, zaimplementowany w komponencie **MatrixRain.tsx**:

```tsx
interface MatrixEffectProps {
  color?: string;
  bgOpacity?: number;
  immediate?: boolean;
  matrixColors?: string[];
}

const MatrixEffect: React.FC<MatrixEffectProps> = ({
  color = "#22b455",
  bgOpacity = 0.05,
  immediate = false,
  matrixColors
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
  useEffect(() => {
    const canvas = document.getElementById("matrixCanvas") as HTMLCanvasElement;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const katakana = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン";
    const latin = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const nums = "0123456789";
    const letters = katakana + latin + nums;

    // Implementacja efektu
    const draw = () => {
      ctx.fillStyle = `rgba(0, 0, 0, ${bgOpacity})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      drops.forEach((y, i) => {
        const text = letters.charAt(Math.floor(Math.random() * letters.length));
        ctx.fillStyle = matrixColors[Math.floor(Math.random() * matrixColors.length)];
        ctx.fillText(text, i * 20, y * 20);
        
        if (y * 20 > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      });
    };

    const intervalId = setInterval(draw, 50);
    return () => clearInterval(intervalId);
  }, [immediate, matrixColors]);

  return <canvas id="matrixCanvas" className="fixed top-0 left-0 w-full h-full z-0 pointer-events-none" />;
};
```

### 2. Animowany tekst (TextReveal)

Efekt "hackowania" tekstu osiągamy poprzez komponent TextReveal, który stopniowo odsłania tekst, początkowo pokazując losowe znaki:

```tsx
const TextReveal = ({ text, interval = 150, onComplete }) => {
  const [displayText, setDisplayText] = useState("");
  
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let currentIndex = 0;
    
    const revealNextChar = () => {
      if (currentIndex < text.length) {
        setDisplayText(prev => 
          prev + text.charAt(currentIndex)
        );
        currentIndex++;
        timeoutId = setTimeout(revealNextChar, interval);
      } else {
        onComplete?.();
      }
    };
    
    revealNextChar();
    return () => clearTimeout(timeoutId);
  }, [text, interval, onComplete]);

  return <span className="matrix-text">{displayText}</span>;
};
```

## Responsywne menu

Menu jest zbudowane z wykorzystaniem Framer Motion dla płynnych animacji:

```tsx
const Sidebar = () => {
  const [showMobileMenu, setShowMobileMenu] = useState(true);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    const threshold = 100;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY - lastScrollY > threshold) {
        setShowMobileMenu(false);
      } else if (lastScrollY - currentScrollY > threshold) {
        setShowMobileMenu(true);
      }
      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.div
      initial={{ y: 0 }}
      animate={{ y: showMobileMenu ? 0 : -100 }}
      transition={{ duration: 0.3 }}
      className="sidebar-mobile-icons"
    >
      {/* Menu content */}
    </motion.div>
  );
};
```

## Formularz kontaktowy z EmailJS

Implementacja formularza kontaktowego wykorzystuje EmailJS dla prostej obsługi bez backendu:

```tsx
const ContactModal = ({ onClose }: ContactModalProps) => {
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formRef.current) return;
    
    try {
      await emailjs.sendForm(
        "service_id",
        "template_id",
        formRef.current,
        "user_id"
      );
      toast({
        title: "Wiadomość wysłana",
        description: "Twoja wiadomość została wysłana pomyślnie."
      });
      onClose();
    } catch (error) {
      toast({
        title: "Błąd",
        description: "Wystąpił błąd przy wysyłaniu wiadomości."
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="contact-modal"
    >
      {/* Form content */}
    </motion.div>
  );
};
```

## Wskazówki implementacyjne

1. **Dostosowanie efektu Matrix:**
   - Modyfikuj **bgOpacity** dla różnej intensywności efektu
   - Dostosuj **interval** w **setInterval** dla różnej szybkości "padania" znaków
   - Zmień zestawy znaków w **letters** dla różnych efektów wizualnych

2. **Optymalizacja animacji:**
   - Używaj **useCallback** dla funkcji w efektach
   - Wykorzystuj **requestAnimationFrame** zamiast **setInterval** dla płynniejszych animacji
   - Dostosuj wartość **threshold** w menu dla lepszej responsywności

3. **Stylowanie:**
   ```css
   :root {
     --matrix-black: #000000;
     --matrix-bg: #0C1714;
     --matrix-darker: #0A3622;
     --matrix-dark: #204829;
     --matrix-primary: #22b455;
     --matrix-light: #80ce87;
     --matrix-hover: #33FF33;
   }
   ```

4. **Responsywność:**
   - Wykorzystuj breakpointy Tailwind (**md:**, **lg:**)
   - Dostosuj wielkość znaków Matrix na różnych urządzeniach
   - Używaj Flexbox i Grid dla lepszego układu

## Dostosowywanie projektu

1. **Zmiana kolorystyki:**
   ```tsx
   const getMatrixColors = () => {
     const rootStyles = getComputedStyle(document.documentElement);
     return [
       rootStyles.getPropertyValue("--matrix-black").trim(),
       rootStyles.getPropertyValue("--matrix-bg").trim(),
       rootStyles.getPropertyValue("--matrix-darker").trim(),
       rootStyles.getPropertyValue("--matrix-dark").trim(),
     ];
   };
   ```

2. **Modyfikacja animacji:**
   - Dostosuj parametry **transition** w komponentach Framer Motion
   - Zmień szybkość pisania w **TextReveal**
   - Modyfikuj efekty hover na kartach i przyciskach

3. **Rozszerzanie funkcjonalności:**
   - Dodaj więcej efektów Matrix
   - Zaimplementuj dodatkowe animacje przejść
   - Rozszerz system motywów

## Podsumowanie

Portfolio w stylu Matrix to świetny sposób na pokazanie swoich umiejętności w atrakcyjny wizualnie sposób. Kluczem do sukcesu jest odpowiednie połączenie efektów wizualnych z dobrą wydajnością i responsywnością.

Pamiętaj o:
- Optymalizacji efektów dla słabszych urządzeń
- Zachowaniu dostępności mimo efektów wizualnych
- Odpowiednim balansie między estetyką a użytecznością
- Testowaniu na różnych urządzeniach i przeglądarkach

## Linki do przydatnych zasobów

- [Framer Motion Examples](https://www.framer.com/motion/examples/)
- [Tailwind CSS Customization](https://tailwindcss.com/docs/customizing-colors)
- [EmailJS Templates](https://www.emailjs.com/docs/tutorial/creating-email-template/)
- [React Performance Optimization](https://react.dev/learn/managing-state)
