import 'dart:io';
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
      title: 'Auto Video Maker',
      theme: ThemeData(
        brightness: Brightness.dark,
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
  String quality = '1080p';
  int fps = 30;

  bool creating = false;

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

  Future<void> createVideo() async {
    if (audioName == null || imageNames.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Сначала выбери озвучку и картинки'),
        ),
      );
      return;
    }

    setState(() {
      creating = true;
    });

    await Future.delayed(const Duration(seconds: 2));

    if (!mounted) return;

    setState(() {
      creating = false;
    });

    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text(
          'Настройки готовы. Следующим шагом подключим создание MP4.',
        ),
      ),
    );
  }

  Widget optionButton(
    String title,
    bool selected,
    VoidCallback onTap,
  ) {
    return Expanded(
      child: Padding(
        padding: const EdgeInsets.all(4),
        child: OutlinedButton(
          onPressed: onTap,
          style: OutlinedButton.styleFrom(
            padding: const EdgeInsets.symmetric(vertical: 14),
          ),
          child: Text(
            title,
            style: TextStyle(
              fontWeight:
                  selected ? FontWeight.bold : FontWeight.normal,
            ),
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Auto Video Maker'),
        centerTitle: true,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            const SizedBox(height: 10),

            const Text(
              'Автоматический монтаж',
              style: TextStyle(
                fontSize: 26,
                fontWeight: FontWeight.bold,
              ),
              textAlign: TextAlign.center,
            ),

            const SizedBox(height: 8),

            const Text(
              'Без сценария и без таймлайна',
              textAlign: TextAlign.center,
              style: TextStyle(
                color: Colors.grey,
                fontSize: 16,
              ),
            ),

            const SizedBox(height: 30),

            ElevatedButton.icon(
              onPressed: pickAudio,
              icon: const Icon(Icons.audio_file),
              label: Text(
                audioName == null
                    ? 'Выбрать озвучку'
                    : audioName!,
              ),
              style: ElevatedButton.styleFrom(
                padding: const EdgeInsets.all(18),
              ),
            ),

            const SizedBox(height: 12),

            ElevatedButton.icon(
              onPressed: pickImages,
              icon: const Icon(Icons.photo_library),
              label: Text(
                imageNames.isEmpty
                    ? 'Выбрать картинки'
                    : 'Выбрано картинок: ${imageNames.length}',
              ),
              style: ElevatedButton.styleFrom(
                padding: const EdgeInsets.all(18),
              ),
            ),

            const SizedBox(height: 30),

            const Text(
              'Формат',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),

            Row(
              children: [
                optionButton(
                  '9:16',
                  format == '9:16',
                  () => setState(() => format = '9:16'),
                ),
                optionButton(
                  '16:9',
                  format == '16:9',
                  () => setState(() => format = '16:9'),
                ),
                optionButton(
                  '1:1',
                  format == '1:1',
                  () => setState(() => format = '1:1'),
                ),
              ],
            ),

            const SizedBox(height: 20),

            const Text(
              'Качество',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),

            Row(
              children: [
                optionButton(
                  '720p',
                  quality == '720p',
                  () => setState(() => quality = '720p'),
                ),
                optionButton(
                  '1080p',
                  quality == '1080p',
                  () => setState(() => quality = '1080p'),
                ),
              ],
            ),

            const SizedBox(height: 20),

            const Text(
              'FPS',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),

            Row(
              children: [
                optionButton(
                  '30 FPS',
                  fps == 30,
                  () => setState(() => fps = 30),
                ),
                optionButton(
                  '60 FPS',
                  fps == 60,
                  () => setState(() => fps = 60),
                ),
              ],
            ),

            const SizedBox(height: 35),

            ElevatedButton(
              onPressed: creating ? null : createVideo,
              style: ElevatedButton.styleFrom(
                padding: const EdgeInsets.all(20),
              ),
              child: creating
                  ? const CircularProgressIndicator()
                  : const Text(
                      'СОЗДАТЬ ВИДЕО',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
            ),

            const SizedBox(height: 20),

            if (imageNames.isNotEmpty)
              Text(
                'Картинок выбрано: ${imageNames.length}',
                textAlign: TextAlign.center,
              ),

            if (audioName != null)
              Text(
                'Озвучка: $audioName',
                textAlign: TextAlign.center,
              ),
          ],
        ),
      ),
    );
  }
}
