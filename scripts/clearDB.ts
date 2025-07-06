import { DatabaseConfig } from '../src/config/database';

async function clearDatabase(): Promise<void> {
  console.log('🗑️  Начинаем очистку базы данных...');
  
  const db = DatabaseConfig.getInstance().getDatabase();
  
  try {
    // Проверяем количество записей
    const count = await new Promise<number>((resolve, reject) => {
      db.get("SELECT COUNT(*) as count FROM colleagues", (err, row: any) => {
        if (err) reject(err);
        else resolve(row.count);
      });
    });

    if (count === 0) {
      console.log('ℹ️  База данных уже пуста.');
      return;
    }

    console.log(`⚠️  Найдено ${count} записей для удаления.`);
    
    // Запрашиваем подтверждение
    const answer = process.argv.includes('--force') ? 'y' : 'n';
    if (answer.toLowerCase() !== 'y') {
      console.log('❌ Операция отменена. Используйте --force для принудительной очистки.');
      return;
    }

    // Удаляем все записи
    await new Promise<void>((resolve, reject) => {
      db.run("DELETE FROM colleagues", function(err) {
        if (err) {
          console.error('❌ Ошибка при очистке базы данных:', err.message);
          reject(err);
        } else {
          console.log(`✅ Удалено ${this.changes} записей из базы данных.`);
          resolve();
        }
      });
    });

    // Сбрасываем автоинкремент
    await new Promise<void>((resolve, reject) => {
      db.run("DELETE FROM sqlite_sequence WHERE name='colleagues'", function(err) {
        if (err) {
          console.error('❌ Ошибка при сбросе автоинкремента:', err.message);
          reject(err);
        } else {
          console.log('✅ Автоинкремент сброшен.');
          resolve();
        }
      });
    });

    console.log('🎉 База данных успешно очищена!');

  } catch (error) {
    console.error('❌ Ошибка при очистке базы данных:', error);
    process.exit(1);
  }
}

// Запускаем скрипт только если он вызван напрямую
if (require.main === module) {
  clearDatabase()
    .then(() => {
      console.log('\n✨ Скрипт завершен успешно!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Критическая ошибка:', error);
      process.exit(1);
    });
}

export { clearDatabase }; 