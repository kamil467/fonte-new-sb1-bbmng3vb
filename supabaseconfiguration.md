# Supabase Configuration

## Database Tables

### Products Table
```sql
create table products (
  id uuid default uuid_generate_v4() primary key,
  name varchar not null,
  description text,
  collection varchar,
  reference varchar,
  composition jsonb,
  technique varchar,
  width varchar,
  weight varchar,
  martindale varchar,
  repeats varchar,
  end_use varchar,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table products enable row level security;
-- Allow public read access
create policy "Allow public read access on products"
  on products for select
  using (true);
```

### Product Colors Table
```sql
create table product_colors (
  id uuid default uuid_generate_v4() primary key,
  product_id uuid references products(id) on delete cascade,
  color_code varchar not null,
  image_url text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table product_colors enable row level security;
-- Allow public read access
create policy "Allow public read access on product_colors"
  on product_colors for select
  using (true);
```

### Product Care Instructions Table
```sql
create table product_care_instructions (
  id uuid default uuid_generate_v4() primary key,
  product_id uuid references products(id) on delete cascade,
  icon varchar not null,
  instruction text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table product_care_instructions enable row level security;
-- Allow public read access
create policy "Allow public read access on product_care_instructions"
  on product_care_instructions for select
  using (true);
```

## Environment Variables
Create a `.env` file in the root directory with the following variables:
```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Sample Data
```sql
-- Insert sample product
INSERT INTO products (name, description, collection, reference, composition, technique, width, weight, martindale, repeats, end_use)
VALUES (
  'Titanium Trm-1001',
  'Titanium brings elegance with its intricate geometric patterns to the Collection. The sophisticated designs in different colors create stunning visual contrasts.',
  'Titanium',
  'TRM 1001',
  '{"main": "100% COTTON", "embroidery": "70% VISCOSE + 30% LUREX"}',
  'CAD EMBRIODERY',
  '3 INCHES',
  '81 GSM',
  'NA',
  'NA',
  'BORDERS'
);

-- Insert color variants
INSERT INTO product_colors (product_id, color_code, image_url)
VALUES 
  ((SELECT id FROM products WHERE reference = 'TRM 1001'), 'C-1', 'https://ik.imagekit.io/kamil467/Fonte/curtain_1.jpeg'),
  ((SELECT id FROM products WHERE reference = 'TRM 1001'), 'C-2', 'https://ik.imagekit.io/kamil467/Fonte/curtain_2.jpeg'),
  ((SELECT id FROM products WHERE reference = 'TRM 1001'), 'C-4', 'https://ik.imagekit.io/kamil467/Fonte/curtain_3.jpeg'),
  ((SELECT id FROM products WHERE reference = 'TRM 1001'), 'C-6', 'https://ik.imagekit.io/kamil467/Fonte/curtain_4.jpeg');

-- Insert care instructions
INSERT INTO product_care_instructions (product_id, icon, instruction)
VALUES 
  ((SELECT id FROM products WHERE reference = 'TRM 1001'), 'P', 'DRY CLEAN ONLY'),
  ((SELECT id FROM products WHERE reference = 'TRM 1001'), '⟰', 'MILD IRON'),
  ((SELECT id FROM products WHERE reference = 'TRM 1001'), '✕', 'DO NOT BLEACH'),
  ((SELECT id FROM products WHERE reference = 'TRM 1001'), '⊗', 'DO NOT TUMBLE DRY');
