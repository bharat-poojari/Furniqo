import json
import re
import json5
from pathlib import Path

def parse_js_array(text: str, var_name: str):
    pattern = rf'export const {var_name} = (\[[\s\S]*?\]);'
    match = re.search(pattern, text)
    if not match:
        raise ValueError(f"Could not find {var_name} array")
    return json5.loads(match.group(1))

def parse_js_object(text: str, var_name: str):
    pattern = rf'export const {var_name} = ({{[\s\S]*?}});'
    match = re.search(pattern, text)
    if not match:
        raise ValueError(f"Could not find {var_name} object")
    return json5.loads(match.group(1))

def bool_to_int(b):
    return 1 if b else 0

def stringify_list(lst):
    if not lst:
        return '[]'
    return json.dumps(lst, ensure_ascii=False)

def js_repr(value):
    """Convert a Python value to a JavaScript literal string."""
    if value is None:
        return 'null'
    if isinstance(value, bool):
        return 'true' if value else 'false'
    if isinstance(value, (int, float)):
        return str(value)
    if isinstance(value, str):
        escaped = value.replace('\\', '\\\\').replace("'", "\\'").replace('\n', '\\n')
        return f"'{escaped}'"
    if isinstance(value, list):
        return f"[{', '.join(js_repr(v) for v in value)}]"
    if isinstance(value, dict):
        items = [f"{js_repr(k)}: {js_repr(v)}" for k, v in value.items()]
        return f"{{{', '.join(items)}}}"
    return str(value)

def convert_products(products_data):
    products = []
    variants = []
    reviews = []
    for p in products_data:
        product = {
            "_id": p["_id"],
            "name": p["name"],
            "slug": p["slug"],
            "description": p["description"],
            "shortDescription": p.get("shortDescription", ""),
            "price": p["price"],
            "originalPrice": p.get("originalPrice", p["price"]),
            "category": p.get("category", ""),
            "subcategory": p.get("subcategory", ""),
            "material": p.get("material", ""),
            "color": p.get("color", ""),
            "style": p.get("style", ""),
            "dimensions": p.get("dimensions", ""),
            "weight": p.get("weight", ""),
            "inStock": bool_to_int(p.get("inStock", False)),
            "stock": p.get("stock", 0),
            "rating": p.get("rating", 0),
            "numReviews": p.get("numReviews", 0),
            "images": stringify_list(p.get("images", [])),
            "features": stringify_list(p.get("features", [])),
            "tags": stringify_list(p.get("tags", [])),
            "featured": bool_to_int(p.get("featured", False)),
            "trending": bool_to_int(p.get("trending", False)),
            "bestSeller": bool_to_int(p.get("bestSeller", False)),
            "newArrival": bool_to_int(p.get("newArrival", False)),
            "onSale": bool_to_int(p.get("onSale", False)),
            "createdAt": p.get("createdAt", ""),
            "updatedAt": p.get("updatedAt", "")
        }
        products.append(product)

        for v in p.get("variants", []):
            variant = {
                "product_id": p["_id"],
                "color": v.get("color", ""),
                "material": v.get("material", ""),
                "size": v.get("size", ""),
                "price": v["price"],
                "stock": v["stock"]
            }
            variants.append(variant)

        for r in p.get("reviews", []):
            review = {
                "_id": r["_id"],
                "product_id": p["_id"],
                "user_name": r["user"],
                "rating": r["rating"],
                "title": r.get("title", ""),
                "comment": r.get("comment", ""),
                "date": r.get("date", ""),
                "verified": bool_to_int(r.get("verified", False)),
                "helpful": r.get("helpful", 0)
            }
            reviews.append(review)

    return products, variants, reviews

def main():
    data_js_path = Path("data.js")
    if not data_js_path.exists():
        print("❌ data.js not found in current directory.")
        return

    with open(data_js_path, "r", encoding="utf-8") as f:
        js_content = f.read()

    print("Parsing products...")
    products_raw = parse_js_array(js_content, "products")
    products, variants, reviews = convert_products(products_raw)

    print("Parsing categories...")
    categories_raw = parse_js_array(js_content, "categories")
    categories = [{"_id": c["_id"], "name": c["name"], "slug": c["slug"], "image": c.get("image", ""),
                   "description": c.get("description", ""), "itemCount": c.get("itemCount", 0),
                   "featured": bool_to_int(c.get("featured", False)), "icon": c.get("icon", "")}
                  for c in categories_raw]

    print("Parsing testimonials...")
    testimonials_raw = parse_js_array(js_content, "testimonials")
    testimonials = [{"_id": t["_id"], "name": t["name"], "role": t.get("role", ""), "location": t.get("location", ""),
                     "image": t.get("image", ""), "content": t.get("content", ""), "rating": t.get("rating", 5),
                     "verified": bool_to_int(t.get("verified", False))} for t in testimonials_raw]

    print("Parsing coupons...")
    coupons_raw = parse_js_array(js_content, "coupons")
    coupons = [{"code": c["code"], "discount": c["discount"], "type": c["type"], "minPurchase": c.get("minPurchase", 0),
                "maxDiscount": c.get("maxDiscount"), "validFrom": c["validFrom"], "validUntil": c["validUntil"],
                "description": c.get("description", ""), "usageLimit": c.get("usageLimit"),
                "usedCount": c.get("usedCount", 0), "isActive": bool_to_int(c.get("isActive", True)),
                "forNewUsers": bool_to_int(c.get("forNewUsers", False))} for c in coupons_raw]

    print("Parsing FAQs...")
    faqs_raw = parse_js_array(js_content, "faqs")
    faqs = [{"question": f["question"], "answer": f["answer"], "category": f.get("category", ""),
             "sortOrder": i+1} for i, f in enumerate(faqs_raw)]

    print("Parsing blog posts...")
    blog_posts_raw = parse_js_array(js_content, "blogPosts")
    blog_posts = [{"_id": b["_id"], "title": b["title"], "slug": b["slug"], "excerpt": b.get("excerpt", ""),
                   "content": b.get("content", ""), "image": b.get("image", ""), "author": b.get("author", ""),
                   "authorRole": b.get("authorRole", ""), "authorImage": b.get("authorImage", ""),
                   "category": b.get("category", ""), "date": b.get("date", ""), "readTime": b.get("readTime", ""),
                   "tags": stringify_list(b.get("tags", [])), "featured": bool_to_int(b.get("featured", False))}
                  for b in blog_posts_raw]

    print("Parsing rooms...")
    rooms_raw = parse_js_array(js_content, "rooms")
    rooms = [{"_id": r["_id"], "name": r["name"], "style": r.get("style", ""), "roomType": r.get("roomType", ""),
              "image": r.get("image", ""), "description": r.get("description", ""), "features": r.get("features", ""),
              "tips": r.get("tips", ""), "products": stringify_list(r.get("products", [])),
              "tags": stringify_list(r.get("tags", []))} for r in rooms_raw]

    print("Parsing hero slides...")
    hero_slides_raw = parse_js_array(js_content, "heroSlides")
    hero_slides = []
    for idx, slide in enumerate(hero_slides_raw, start=1):
        hero_slides.append({
            "id": idx,
            "title": slide["title"],
            "subtitle": slide.get("subtitle", ""),
            "image": slide["image"],
            "cta_text": slide.get("cta", ""),
            "cta_link": slide.get("link", ""),
            "text_color": slide.get("textColor", "light"),
            "sort_order": idx,
            "is_active": 1
        })

    print("Parsing policies...")
    policies_raw = parse_js_object(js_content, "policies")
    # policies_raw is a dict with keys: privacy, terms, shipping, returns
    policies_list = []
    for policy_type, policy_data in policies_raw.items():
        policies_list.append({
            "type": policy_type,
            "title": policy_data.get("title", ""),
            "last_updated": policy_data.get("lastUpdated", ""),
            "content": json.dumps(policy_data)  # store full object as JSON string
        })

    # Write output file
    with open("seedData.js", "w", encoding="utf-8") as f:
        f.write("const { v4: uuidv4 } = require('uuid');\n")
        f.write("const bcrypt = require('bcryptjs');\n\n")
        
        # Write all data arrays
        f.write("// ============================================\n")
        f.write("// PRODUCTS DATA\n")
        f.write("// ============================================\n\n")
        f.write("const productsData = [\n")
        for p in products:
            f.write("  {\n")
            for k, v in p.items():
                f.write(f"    {k}: {js_repr(v)},\n")
            f.write("  },\n")
        f.write("];\n\n")

        f.write("const productVariantsData = [\n")
        for v in variants:
            f.write(f"  {js_repr(v)},\n")
        f.write("];\n\n")

        f.write("const productReviewsData = [\n")
        for r in reviews:
            f.write(f"  {js_repr(r)},\n")
        f.write("];\n\n")

        f.write("const categoriesData = [\n")
        for c in categories:
            f.write(f"  {js_repr(c)},\n")
        f.write("];\n\n")

        f.write("const testimonialsData = [\n")
        for t in testimonials:
            f.write(f"  {js_repr(t)},\n")
        f.write("];\n\n")

        f.write("const couponsData = [\n")
        for c in coupons:
            f.write(f"  {js_repr(c)},\n")
        f.write("];\n\n")

        f.write("const faqsData = [\n")
        for fq in faqs:
            f.write(f"  {js_repr(fq)},\n")
        f.write("];\n\n")

        f.write("const blogPostsData = [\n")
        for bp in blog_posts:
            f.write(f"  {js_repr(bp)},\n")
        f.write("];\n\n")

        f.write("const roomsData = [\n")
        for rm in rooms:
            f.write(f"  {js_repr(rm)},\n")
        f.write("];\n\n")

        f.write("const heroSlidesData = [\n")
        for hs in hero_slides:
            f.write(f"  {js_repr(hs)},\n")
        f.write("];\n\n")

        f.write("const policiesData = [\n")
        for pol in policies_list:
            f.write(f"  {js_repr(pol)},\n")
        f.write("];\n\n")

        # Write seedDatabase function (include hero slides and policies seeding)
        f.write("""
// ============================================
// MAIN SEED FUNCTION
// ============================================

const seedDatabase = async (db) => {
  try {
    const productCount = await db.get('SELECT COUNT(*) as count FROM products');
    
    if (productCount.count === 0) {
      console.log('🌱 Seeding database with initial data...');
      
      // Admin user
      const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'Admin123456', 10);
      const adminId = uuidv4();
      await db.run(`
        INSERT OR IGNORE INTO users (_id, name, email, password, role)
        VALUES (?, ?, ?, ?, ?)
      `, [adminId, 'Admin', process.env.ADMIN_EMAIL || 'admin@furniqo.com', hashedPassword, 'admin']);
      console.log('✅ Admin user seeded');
      
      // Products
      for (const product of productsData) {
        await db.run(`
          INSERT OR REPLACE INTO products (
            _id, name, slug, description, shortDescription, price, originalPrice,
            category, subcategory, material, color, style, dimensions, weight,
            inStock, stock, rating, numReviews, images, features, tags,
            featured, trending, bestSeller, newArrival, onSale, createdAt, updatedAt
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          product._id, product.name, product.slug, product.description, product.shortDescription,
          product.price, product.originalPrice, product.category, product.subcategory,
          product.material, product.color, product.style, product.dimensions, product.weight,
          product.inStock, product.stock, product.rating, product.numReviews,
          product.images, product.features, product.tags, product.featured,
          product.trending, product.bestSeller, product.newArrival, product.onSale,
          product.createdAt, product.updatedAt
        ]);
      }
      console.log(`✅ Seeded ${productsData.length} products`);
      
      // Variants
      for (const variant of productVariantsData) {
        await db.run(`
          INSERT OR IGNORE INTO product_variants (product_id, color, material, size, price, stock)
          VALUES (?, ?, ?, ?, ?, ?)
        `, [variant.product_id, variant.color || null, variant.material || null, variant.size || null, variant.price, variant.stock]);
      }
      console.log(`✅ Seeded ${productVariantsData.length} variants`);
      
      // Reviews
      for (const review of productReviewsData) {
        await db.run(`
          INSERT OR IGNORE INTO product_reviews (_id, product_id, user_name, rating, title, comment, date, verified, helpful)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [review._id, review.product_id, review.user_name, review.rating, review.title, review.comment, review.date, review.verified, review.helpful]);
      }
      console.log(`✅ Seeded ${productReviewsData.length} reviews`);
      
      // Categories
      for (const category of categoriesData) {
        await db.run(`
          INSERT OR REPLACE INTO categories (_id, name, slug, image, description, itemCount, featured, icon)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `, [category._id, category.name, category.slug, category.image, category.description, category.itemCount, category.featured, category.icon]);
      }
      console.log(`✅ Seeded ${categoriesData.length} categories`);
      
      // Testimonials
      for (const testimonial of testimonialsData) {
        await db.run(`
          INSERT OR REPLACE INTO testimonials (_id, name, role, location, image, content, rating, verified)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `, [testimonial._id, testimonial.name, testimonial.role, testimonial.location, testimonial.image, testimonial.content, testimonial.rating, testimonial.verified]);
      }
      console.log(`✅ Seeded ${testimonialsData.length} testimonials`);
      
      // Coupons
      for (const coupon of couponsData) {
        await db.run(`
          INSERT OR REPLACE INTO coupons (
            code, discount, type, minPurchase, maxDiscount, validFrom, validUntil,
            description, usageLimit, usedCount, isActive, forNewUsers
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [coupon.code, coupon.discount, coupon.type, coupon.minPurchase, coupon.maxDiscount, coupon.validFrom, coupon.validUntil, coupon.description, coupon.usageLimit, coupon.usedCount, coupon.isActive, coupon.forNewUsers]);
      }
      console.log(`✅ Seeded ${couponsData.length} coupons`);
      
      // FAQs
      for (const faq of faqsData) {
        await db.run(`
          INSERT OR REPLACE INTO faqs (question, answer, category, sortOrder)
          VALUES (?, ?, ?, ?)
        `, [faq.question, faq.answer, faq.category, faq.sortOrder]);
      }
      console.log(`✅ Seeded ${faqsData.length} FAQs`);
      
      // Blog posts
      for (const post of blogPostsData) {
        await db.run(`
          INSERT OR REPLACE INTO blog_posts (
            _id, title, slug, excerpt, content, image, author, authorRole,
            authorImage, category, date, readTime, tags, featured
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [post._id, post.title, post.slug, post.excerpt, post.content, post.image, post.author, post.authorRole, post.authorImage, post.category, post.date, post.readTime, post.tags, post.featured]);
      }
      console.log(`✅ Seeded ${blogPostsData.length} blog posts`);
      
      // Rooms
      for (const room of roomsData) {
        await db.run(`
          INSERT OR REPLACE INTO rooms (_id, name, style, roomType, image, description, features, tips, products, tags)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [room._id, room.name, room.style, room.roomType, room.image, room.description, room.features, room.tips, room.products, room.tags]);
      }
      console.log(`✅ Seeded ${roomsData.length} rooms`);
      
      // Hero Slides
      for (const slide of heroSlidesData) {
        await db.run(`
          INSERT OR REPLACE INTO hero_slides (id, title, subtitle, image, cta_text, cta_link, text_color, sort_order, is_active)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [slide.id, slide.title, slide.subtitle, slide.image, slide.cta_text, slide.cta_link, slide.text_color, slide.sort_order, slide.is_active]);
      }
      console.log(`✅ Seeded ${heroSlidesData.length} hero slides`);
      
      // Policies
      for (const policy of policiesData) {
        await db.run(`
          INSERT OR REPLACE INTO policies (type, title, last_updated, content)
          VALUES (?, ?, ?, ?)
        `, [policy.type, policy.title, policy.last_updated, policy.content]);
      }
      console.log(`✅ Seeded ${policiesData.length} policies`);
      
      console.log('\\n🎉 Database seeded successfully!');
      console.log('📊 Summary:');
      console.log(`   - ${productsData.length} products`);
      console.log(`   - ${productVariantsData.length} variants`);
      console.log(`   - ${productReviewsData.length} reviews`);
      console.log(`   - ${categoriesData.length} categories`);
      console.log(`   - ${testimonialsData.length} testimonials`);
      console.log(`   - ${couponsData.length} coupons`);
      console.log(`   - ${faqsData.length} FAQs`);
      console.log(`   - ${blogPostsData.length} blog posts`);
      console.log(`   - ${roomsData.length} rooms`);
      console.log(`   - ${heroSlidesData.length} hero slides`);
      console.log(`   - ${policiesData.length} policies`);
      console.log('\\n🔑 Admin Login:');
      console.log('   Email: admin@furniqo.com');
      console.log('   Password: Admin123456\\n');
    } else {
      console.log('📦 Database already contains data, skipping seed.');
    }
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  }
};

module.exports = { seedDatabase };
""")
    print("✅ Conversion complete! seedData.js now includes heroSlides and policies.")

if __name__ == "__main__":
    main()