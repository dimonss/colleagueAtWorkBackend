import { DatabaseConfig } from '../src/config/database';

interface MockColleague {
  name: string;
  position: string;
  department: string;
  email: string;
  phone: string;
  hire_date: string;
  salary: number;
  notes: string;
}

const mockColleagues: MockColleague[] = [
  {
    name: "Иван Петров",
    position: "Senior Software Engineer",
    department: "Engineering",
    email: "ivan.petrov@company.com",
    phone: "+7 (900) 123-45-67",
    hire_date: "2022-03-15",
    salary: 120000,
    notes: "Отличный разработчик, специалист по React и Node.js"
  },
  {
    name: "Анна Сидорова",
    position: "UI/UX Designer",
    department: "Design",
    email: "anna.sidorova@company.com",
    phone: "+7 (900) 234-56-78",
    hire_date: "2023-01-10",
    salary: 95000,
    notes: "Креативный дизайнер, создает потрясающие интерфейсы"
  },
  {
    name: "Михаил Козлов",
    position: "Product Manager",
    department: "Product",
    email: "mikhail.kozlov@company.com",
    phone: "+7 (900) 345-67-89",
    hire_date: "2021-11-20",
    salary: 140000,
    notes: "Опытный продакт-менеджер, отлично понимает потребности пользователей"
  },
  {
    name: "Елена Волкова",
    position: "QA Engineer",
    department: "Quality Assurance",
    email: "elena.volkova@company.com",
    phone: "+7 (900) 456-78-90",
    hire_date: "2023-06-05",
    salary: 85000,
    notes: "Внимательный тестировщик, находит все баги"
  },
  {
    name: "Дмитрий Новиков",
    position: "DevOps Engineer",
    department: "Infrastructure",
    email: "dmitry.novikov@company.com",
    phone: "+7 (900) 567-89-01",
    hire_date: "2022-08-12",
    salary: 110000,
    notes: "Обеспечивает стабильную работу всех сервисов"
  },
  {
    name: "Ольга Морозова",
    position: "Frontend Developer",
    department: "Engineering",
    email: "olga.morozova@company.com",
    phone: "+7 (900) 678-90-12",
    hire_date: "2023-04-18",
    salary: 90000,
    notes: "Молодой талантливый разработчик, быстро учится"
  },
  {
    name: "Сергей Лебедев",
    position: "Backend Developer",
    department: "Engineering",
    email: "sergey.lebedev@company.com",
    phone: "+7 (900) 789-01-23",
    hire_date: "2021-09-30",
    salary: 100000,
    notes: "Специалист по микросервисам и базам данных"
  },
  {
    name: "Мария Соколова",
    position: "Marketing Manager",
    department: "Marketing",
    email: "maria.sokolova@company.com",
    phone: "+7 (900) 890-12-34",
    hire_date: "2023-02-14",
    salary: 80000,
    notes: "Продвигает наш продукт в социальных сетях"
  },
  {
    name: "Алексей Попов",
    position: "Data Analyst",
    department: "Analytics",
    email: "alexey.popov@company.com",
    phone: "+7 (900) 901-23-45",
    hire_date: "2022-12-03",
    salary: 95000,
    notes: "Анализирует данные и помогает принимать решения"
  },
  {
    name: "Татьяна Воробьева",
    position: "HR Manager",
    department: "Human Resources",
    email: "tatiana.vorobyeva@company.com",
    phone: "+7 (900) 012-34-56",
    hire_date: "2021-07-22",
    salary: 75000,
    notes: "Заботится о команде и корпоративной культуре"
  }
];

async function seedDatabase(): Promise<void> {
  console.log('🌱 Начинаем заполнение базы данных мок данными...');
  
  const db = DatabaseConfig.getInstance().getDatabase();
  
  try {
    // Проверяем, есть ли уже данные в таблице
    const existingCount = await new Promise<number>((resolve, reject) => {
      db.get("SELECT COUNT(*) as count FROM colleagues", (err, row: any) => {
        if (err) reject(err);
        else resolve(row.count);
      });
    });

    if (existingCount > 0) {
      console.log(`⚠️  В базе данных уже есть ${existingCount} записей.`);
      const answer = process.argv.includes('--force') ? 'y' : 'n';
      if (answer.toLowerCase() !== 'y') {
        console.log('❌ Операция отменена. Используйте --force для принудительного добавления.');
        return;
      }
      console.log('🔄 Принудительное добавление данных...');
    }

    // Добавляем мок данные
    let addedCount = 0;
    
    for (const colleague of mockColleagues) {
      await new Promise<void>((resolve, reject) => {
        db.run(`
          INSERT INTO colleagues (name, position, department, email, phone, hire_date, salary, notes)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          colleague.name,
          colleague.position,
          colleague.department,
          colleague.email,
          colleague.phone,
          colleague.hire_date,
          colleague.salary,
          colleague.notes
        ], function(err) {
          if (err) {
            console.error(`❌ Ошибка при добавлении ${colleague.name}:`, err.message);
            reject(err);
          } else {
            addedCount++;
            console.log(`✅ Добавлен: ${colleague.name} - ${colleague.position}`);
            resolve();
          }
        });
      });
    }

    console.log(`\n🎉 Успешно добавлено ${addedCount} сотрудников!`);
    
    // Показываем статистику
    const totalCount = await new Promise<number>((resolve, reject) => {
      db.get("SELECT COUNT(*) as count FROM colleagues", (err, row: any) => {
        if (err) reject(err);
        else resolve(row.count);
      });
    });

    console.log(`📊 Всего сотрудников в базе: ${totalCount}`);
    
    // Показываем статистику по отделам
    const deptStats = await new Promise<any[]>((resolve, reject) => {
      db.all(`
        SELECT department, COUNT(*) as count 
        FROM colleagues 
        GROUP BY department 
        ORDER BY count DESC
      `, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });

    console.log('\n📈 Статистика по отделам:');
    deptStats.forEach(dept => {
      console.log(`   ${dept.department}: ${dept.count} сотрудников`);
    });

  } catch (error) {
    console.error('❌ Ошибка при заполнении базы данных:', error);
    process.exit(1);
  }
}

// Запускаем скрипт только если он вызван напрямую
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('\n✨ Скрипт завершен успешно!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Критическая ошибка:', error);
      process.exit(1);
    });
}

export { seedDatabase, mockColleagues }; 