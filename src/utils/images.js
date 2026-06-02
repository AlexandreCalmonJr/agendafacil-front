const profImages = {
  'Dr. Carlos Eduardo': 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop',
  'Dra. Ana Beatrix': 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop',
  'Dr. Ricardo Santos': 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=400&fit=crop',
  'Dra. Mariana Luz': 'https://images.unsplash.com/photo-1559839734-2b71f1e3c770?w=400&h=400&fit=crop',
  'Dr. Henrique Silva': 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&h=400&fit=crop',
  'Dra. Letícia Costa': 'https://images.unsplash.com/photo-1527613426441-4da17471b66d?w=400&h=400&fit=crop'
};

const defaultFallback = 'https://ui-avatars.com/api/?name=';
const defaultBg = '15803d';

export function getProfImage(nome) {
  return profImages[nome] || `${defaultFallback}${encodeURIComponent(nome)}&background=${defaultBg}&color=fff`;
}

const specialtyImages = {
  'Cardiologia': 'https://images.unsplash.com/photo-1628178144529-2a512f28f991?w=400&h=300&fit=crop',
  'Pediatria': 'https://images.unsplash.com/photo-1581594658210-c5c85ce9d03d?w=400&h=300&fit=crop',
  'Dermatologia': 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&h=300&fit=crop',
  'Ortopedia': 'https://images.unsplash.com/photo-1579389083046-e3df9c2b3325?w=400&h=300&fit=crop',
  'Ginecologia': 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=400&h=300&fit=crop',
  'Neurologia': 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=400&h=300&fit=crop',
  'Urologia': 'https://images.unsplash.com/photo-1579154235828-ac7a61d67417?w=400&h=300&fit=crop',
  'Psiquiatria': 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&h=300&fit=crop',
  'Psiquiatria Clínica': 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&h=300&fit=crop',
  'Oftalmologia': 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&h=300&fit=crop',
  'Endocrinologia': 'https://images.unsplash.com/photo-1511174511562-5f7f18585481?w=400&h=300&fit=crop',
  'Otorrinolaringologia': 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop',
  'Gastrenterologia': 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=400&h=300&fit=crop',
  'Pneumologia': 'https://images.unsplash.com/photo-1559757117-5941c424b4f4?w=400&h=300&fit=crop',
  'Hematologia': 'https://images.unsplash.com/photo-1579154235828-ac7a61d67417?w=400&h=300&fit=crop',
  'Nutrologia': 'https://images.unsplash.com/photo-1490818387583-1baba5e638af?w=400&h=300&fit=crop',
  'Geriatria': 'https://images.unsplash.com/photo-1581578731522-99c56ca310bd?w=400&h=300&fit=crop'
};

const defaultSpecialtyImage = 'https://images.unsplash.com/photo-1505751172107-57322a39d4b6?w=400&h=300&fit=crop';

export function getSpecialtyImage(especialidade) {
  return specialtyImages[especialidade] || defaultSpecialtyImage;
}

export function getSaudacao() {
  const hora = new Date().getHours();
  if (hora < 12) return 'Bom dia';
  if (hora < 18) return 'Boa tarde';
  return 'Boa noite';
}
