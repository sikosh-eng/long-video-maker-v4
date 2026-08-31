import 'package:flutter/material.dart';
import 'package:file_picker/file_picker.dart';

void main() {
  runApp(const AutoVideoMaker());
}

class AutoVideoMaker extends StatelessWidget {
  const AutoVideoMaker({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'Long Video Maker',
      theme: ThemeData(
        brightness: Brightness.dark,
        scaffoldBackgroundColor: const Color(0xFF0F1117),
        colorScheme: ColorScheme.fromSeed(
          seedColor: Colors.deepPurple,
          brightness: Brightness.dark,
        ),
        useMaterial3: true,
      ),
      home: const HomePage(),
    );
  }
}

class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  String? audioName;
  List<String> imageNames = [];

  String format = '9:16';
  String resolution = '1080p';
  int fps = 30;

  Future<void> pickAudio() async {
    final result = await FilePicker.platform.pickFiles(
      type: FileType.audio,
    );

    if (result != null && result.files.isNotEmpty) {
      setState(() {
        audioName = result.files.first.name;
      });
    }
  }

  Future<void> pickImages() async {
    final result = await FilePicker.platform.pickFiles(
      type: FileType.image,
      allowMultiple: true,
    );

    if (result != null) {
      setState(() {
        imageNames = result.files.map((file) => file.name).toList();
      });
    }
  }

  void createVideo() {
    if (audioName == null || imageNames.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Сначала добавь озвучку и картинки'),
        ),
      );
      return;
    }

    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Подготовка автоматического монтажа...'),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text(
          'Long Video Maker',
          style: TextStyle(fontWeight: FontWeight.bold),
        ),
        centerTitle: true,
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const Text(
                'AI Auto Video Maker',
                style: TextStyle(
                  fontSize: 28,
                  fontWeight: FontWeight.bold,
                ),
              ),

              const SizedBox(height: 8),

              Text(
                'Добавь озвучку и картинки — остальное сделает приложение.',
                style: TextStyle(
                  color: Colors.grey.shade400,
                  fontSize: 15,
                ),
              ),

              const SizedBox(height: 25),

              _uploadCard(
                icon: Icons.mic,
                title: 'Озвучка',
                subtitle: audioName ?? 'MP3 или WAV',
                onTap: pickAudio,
                active: audioName != null,
              ),

              const SizedBox(height: 15),

              _uploadCard(
                icon: Icons.photo_library,
                title: 'Картинки',
                subtitle: imageNames.isEmpty
                    ? 'Выбери изображения'
                    : '${imageNames.length} изображений выбрано',
                onTap: pickImages,
                active: imageNames.isNotEmpty,
              ),

              const SizedBox(height: 25),

              const Text(
                'Настройки видео',
                style: TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                ),
              ),

              const SizedBox(height: 15),

              _settingsCard(),

              const SizedBox(height: 25),

              ElevatedButton(
                onPressed: createVideo,
                style: ElevatedButton.styleFrom(
                  padding: const EdgeInsets.symmetric(vertical: 17),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(15),
                  ),
                ),
                child: const Text(
                  '✨ СОЗДАТЬ ВИДЕО',
                  style: TextStyle(
                    fontSize: 17,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _uploadCard({
    required IconData icon,
    required String title,
    required String subtitle,
    required VoidCallback onTap,
    required bool active,
  }) {
    return Card(
      elevation: 0,
      color: const Color(0xFF191C25),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(18),
        side: BorderSide(
          color: active
              ? Colors.deepPurple
              : Colors.white.withOpacity(0.08),
        ),
      ),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(18),
        child: Padding(
          padding: const EdgeInsets.all(18),
          child: Row(
            children: [
              Container(
                width: 55,
                height: 55,
                decoration: BoxDecoration(
                  color: Colors.deepPurple.withOpacity(0.2),
                  borderRadius: BorderRadius.circular(15),
                ),
                child: Icon(
                  icon,
                  color: Colors.deepPurple.shade200,
                  size: 28,
                ),
              ),

              const SizedBox(width: 15),

              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      title,
                      style: const TextStyle(
                        fontSize: 17,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 5),
                    Text(
                      subtitle,
                      overflow: TextOverflow.ellipsis,
                      style: TextStyle(
                        color: Colors.grey.shade400,
                      ),
                    ),
                  ],
                ),
              ),

              const Icon(Icons.arrow_forward_ios, size: 18),
            ],
          ),
        ),
      ),
    );
  }

  Widget _settingsCard() {
    return Card(
      elevation: 0,
      color: const Color(0xFF191C25),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(18),
      ),
      child: Padding(
        padding: const EdgeInsets.all(18),
        child: Column(
          children: [
            _dropdown(
              title: 'Формат',
              value: format,
              items: const ['9:16', '16:9', '1:1'],
              onChanged: (value) {
                setState(() {
                  format = value!;
                });
              },
            ),

            const SizedBox(height: 15),

            _dropdown(
              title: 'Разрешение',
              value: resolution,
              items: const ['720p', '1080p', '1440p', '2160p'],
              onChanged: (value) {
                setState(() {
                  resolution = value!;
                });
              },
            ),

            const SizedBox(height: 15),

            _dropdown(
              title: 'FPS',
              value: fps.toString(),
              items: const ['24', '30', '60'],
              onChanged: (value) {
                setState(() {
                  fps = int.parse(value!);
                });
              },
            ),
          ],
        ),
      ),
    );
  }

  Widget _dropdown({
    required String title,
    required String value,
    required List<String> items,
    required ValueChanged<String?> onChanged,
  }) {
    return Row(
      children: [
        Expanded(
          child: Text(
            title,
            style: const TextStyle(fontSize: 16),
          ),
        ),
        DropdownButton<String>(
          value: value,
          items: items
              .map(
                (item) => DropdownMenuItem(
                  value: item,
                  child: Text(item),
                ),
              )
              .toList(),
          onChanged: onChanged,
        ),
      ],
    );
  }
}
