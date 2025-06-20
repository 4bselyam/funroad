// seed-direct.ts
import { MongoClient } from 'mongodb'
// или для PostgreSQL: import { Client } from 'pg'
// или для SQLite: import Database from 'better-sqlite3'

const categories = [
	{
		name: 'All',
		slug: 'all',
	},
	{
		name: 'Business & Money',
		color: '#FFB347',
		slug: 'business-money',
		subcategories: [
			{ name: 'Accounting', slug: 'accounting' },
			{ name: 'Entrepreneurship', slug: 'entrepreneurship' },
			{ name: 'Gigs & Side Projects', slug: 'gigs-side-projects' },
			{ name: 'Investing', slug: 'investing' },
			{ name: 'Management & Leadership', slug: 'management-leadership' },
			{ name: 'Marketing & Sales', slug: 'marketing-sales' },
			{ name: 'Networking, Careers & Jobs', slug: 'networking-careers-jobs' },
			{ name: 'Personal Finance', slug: 'personal-finance' },
			{ name: 'Real Estate', slug: 'real-estate' },
		],
	},
	{
		name: 'Software Development',
		color: '#7EC8E3',
		slug: 'software-development',
		subcategories: [
			{ name: 'Web Development', slug: 'web-development' },
			{ name: 'Mobile Development', slug: 'mobile-development' },
			{ name: 'Game Development', slug: 'game-development' },
			{ name: 'Programming Languages', slug: 'programming-languages' },
			{ name: 'DevOps', slug: 'devops' },
		],
	},
	{
		name: 'Writing & Publishing',
		color: '#D8B5FF',
		slug: 'writing-publishing',
		subcategories: [
			{ name: 'Fiction', slug: 'fiction' },
			{ name: 'Non-Fiction', slug: 'non-fiction' },
			{ name: 'Blogging', slug: 'blogging' },
			{ name: 'Copywriting', slug: 'copywriting' },
			{ name: 'Self-Publishing', slug: 'self-publishing' },
		],
	},
	{
		name: 'Other',
		slug: 'other',
	},
	{
		name: 'Education',
		color: '#FFE066',
		slug: 'education',
		subcategories: [
			{ name: 'Online Courses', slug: 'online-courses' },
			{ name: 'Tutoring', slug: 'tutoring' },
			{ name: 'Test Preparation', slug: 'test-preparation' },
			{ name: 'Language Learning', slug: 'language-learning' },
		],
	},
	{
		name: 'Self Improvement',
		color: '#96E6B3',
		slug: 'self-improvement',
		subcategories: [
			{ name: 'Productivity', slug: 'productivity' },
			{ name: 'Personal Development', slug: 'personal-development' },
			{ name: 'Mindfulness', slug: 'mindfulness' },
			{ name: 'Career Growth', slug: 'career-growth' },
		],
	},
	{
		name: 'Fitness & Health',
		color: '#FF9AA2',
		slug: 'fitness-health',
		subcategories: [
			{ name: 'Workout Plans', slug: 'workout-plans' },
			{ name: 'Nutrition', slug: 'nutrition' },
			{ name: 'Mental Health', slug: 'mental-health' },
			{ name: 'Yoga', slug: 'yoga' },
		],
	},
	{
		name: 'Design',
		color: '#B5B9FF',
		slug: 'design',
		subcategories: [
			{ name: 'UI/UX', slug: 'ui-ux' },
			{ name: 'Graphic Design', slug: 'graphic-design' },
			{ name: '3D Modeling', slug: '3d-modeling' },
			{ name: 'Typography', slug: 'typography' },
		],
	},
	{
		name: 'Drawing & Painting',
		color: '#FFCAB0',
		slug: 'drawing-painting',
		subcategories: [
			{ name: 'Watercolor', slug: 'watercolor' },
			{ name: 'Acrylic', slug: 'acrylic' },
			{ name: 'Oil', slug: 'oil' },
			{ name: 'Pastel', slug: 'pastel' },
			{ name: 'Charcoal', slug: 'charcoal' },
		],
	},
	{
		name: 'Music',
		color: '#FFD700',
		slug: 'music',
		subcategories: [
			{ name: 'Songwriting', slug: 'songwriting' },
			{ name: 'Music Production', slug: 'music-production' },
			{ name: 'Music Theory', slug: 'music-theory' },
			{ name: 'Music History', slug: 'music-history' },
		],
	},
	{
		name: 'Photography',
		color: '#FF6B6B',
		slug: 'photography',
		subcategories: [
			{ name: 'Portrait', slug: 'portrait' },
			{ name: 'Landscape', slug: 'landscape' },
			{ name: 'Street Photography', slug: 'street-photography' },
			{ name: 'Nature', slug: 'nature' },
			{ name: 'Macro', slug: 'macro' },
		],
	},
]

// Для MongoDB
async function seedMongoDB() {
	const client = new MongoClient(process.env.DATABASE_URI || 'mongodb://localhost:27017/your-db')
	await client.connect()
	const db = client.db()
	const collection = db.collection('categories')

	// Очистить коллекцию
	await collection.deleteMany({})

	for (const category of categories) {
		const parentDoc = {
			name: category.name,
			slug: category.slug,
			color: category.color || null,
			parent: null,
			createdAt: new Date(),
			updatedAt: new Date(),
		}

		const parentResult = await collection.insertOne(parentDoc)
		console.log(`Created parent category: ${category.name}`)

		if (category.subcategories) {
			for (const subcategory of category.subcategories) {
				const subDoc = {
					name: subcategory.name,
					slug: subcategory.slug,
					parent: parentResult.insertedId,
					createdAt: new Date(),
					updatedAt: new Date(),
				}
				await collection.insertOne(subDoc)
				console.log(`  Created subcategory: ${subcategory.name}`)
			}
		}
	}

	await client.close()
	console.log('Seeding completed!')
}

// Для PostgreSQL
async function seedPostgreSQL() {
	const { Client } = require('pg')
	const client = new Client({
		connectionString: process.env.DATABASE_URI || 'postgresql://user:password@localhost:5432/your-db',
	})

	await client.connect()

	// Очистить таблицу
	await client.query('DELETE FROM categories')

	for (const category of categories) {
		const parentResult = await client.query(
			'INSERT INTO categories (name, slug, color, parent, "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
			[category.name, category.slug, category.color || null, null, new Date(), new Date()]
		)

		const parentId = parentResult.rows[0].id
		console.log(`Created parent category: ${category.name}`)

		if (category.subcategories) {
			for (const subcategory of category.subcategories) {
				await client.query(
					'INSERT INTO categories (name, slug, parent, "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, $5)',
					[subcategory.name, subcategory.slug, parentId, new Date(), new Date()]
				)
				console.log(`  Created subcategory: ${subcategory.name}`)
			}
		}
	}

	await client.end()
	console.log('Seeding completed!')
}

// Запуск
async function main() {
	try {
		// Выберите нужную функцию в зависимости от вашей БД
		await seedMongoDB()
		// или await seedPostgreSQL()

		process.exit(0)
	} catch (error) {
		console.error('Seeding failed:', error)
		process.exit(1)
	}
}

main()
